// MOST Petersburg Worker: static assets + server-side Stripe payment endpoints.
// Configure QUOTES KV, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET as Cloudflare bindings.
// Until then, payment endpoints fail closed; static pages remain available.
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
const validId=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{8,80}$/.test(x);
const form=o=>{const p=new URLSearchParams();for(const [k,v] of Object.entries(o))if(v!==undefined&&v!==null)p.set(k,String(v));return p};
async function checkout(request,env,url){
  if(!env.STRIPE_SECRET_KEY||!env.QUOTES)return json({error:"Payments are not enabled."},503);
  if(request.headers.get("Origin")!==url.origin)return json({error:"Invalid origin"},403);
  if(Number(request.headers.get("content-length")||0)>4096)return json({error:"Request too large"},413);
  let input;try{input=await request.json()}catch{return json({error:"Invalid JSON"},400)}
  const id=input?.quote_id;
  if(!validId(id))return json({error:"Invalid quote"},400);
  const quote=await env.QUOTES.get("quote:"+id,{type:"json"});
  if(!quote||quote.status!=="approved"||!Number.isSafeInteger(quote.amount_minor)||quote.amount_minor<50||!["usd","eur","thb","sgd","gbp"].includes(quote.currency)||typeof quote.description!=="string"||!quote.description.trim())return json({error:"Quote not available"},404);
  if(quote.expires_at&&Date.now()>Date.parse(quote.expires_at))return json({error:"Quote expired"},410);
  const p=form({mode:"payment",success_url:url.origin+"/payment-result.html?status=return&session_id={CHECKOUT_SESSION_ID}",cancel_url:url.origin+"/payment-result.html?status=cancelled",client_reference_id:id,"metadata[quote_id]":id,"payment_intent_data[metadata][quote_id]":id,"line_items[0][price_data][currency]":quote.currency,"line_items[0][price_data][unit_amount]":quote.amount_minor,"line_items[0][price_data][product_data][name]":quote.description.slice(0,120),"line_items[0][quantity]":1,customer_email:quote.customer_email||undefined});
  const res=await fetch("https://api.stripe.com/v1/checkout/sessions",{method:"POST",headers:{Authorization:"Bearer "+env.STRIPE_SECRET_KEY,"Content-Type":"application/x-www-form-urlencoded","Idempotency-Key":"mostpetersburg-quote-"+id},body:p});
  let data;try{data=await res.json()}catch{return json({error:"Payment provider unavailable"},502)}
  if(!res.ok||!data.url)return json({error:"Checkout unavailable"},502);
  // Idempotency key ensures repeated requests return the same Stripe session.
  await env.QUOTES.put("quote:"+id,JSON.stringify({...quote,status:"checkout_created",stripe_session_id:data.id}));
  return json({url:data.url});
}
function hex(bytes){return Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,"0")).join("")}
async function verifyStripe(payload,header,secret){
  if(!header||!secret)return false;
  const fields=Object.fromEntries(header.split(",").map(s=>s.trim().split("=",2)));
  const timestamp=Number(fields.t);
  if(!Number.isSafeInteger(timestamp)||Math.abs(Date.now()/1000-timestamp)>300)return false;
  const signatures=header.split(",").filter(s=>s.trim().startsWith("v1=")).map(s=>s.trim().slice(3));
  if(!signatures.length)return false;
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const expected=hex(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(fields.t+"."+payload)));
  return signatures.some(sig=>sig.length===expected.length&&[...sig].reduce((n,c,i)=>n|(c.charCodeAt(0)^expected.charCodeAt(i)),0)===0);
}
async function webhook(request,env){
  if(!env.STRIPE_WEBHOOK_SECRET||!env.QUOTES)return json({error:"Webhook not configured"},503);
  const payload=await request.text();
  if(payload.length>100000)return json({error:"Payload too large"},413);
  if(!await verifyStripe(payload,request.headers.get("Stripe-Signature"),env.STRIPE_WEBHOOK_SECRET))return json({error:"Invalid signature"},400);
  let event;try{event=JSON.parse(payload)}catch{return json({error:"Invalid payload"},400)}
  if(!["checkout.session.completed","checkout.session.async_payment_succeeded","checkout.session.async_payment_failed","checkout.session.expired"].includes(event.type))return json({received:true});
  const session=event.data?.object;
  const id=session?.client_reference_id;
  if(!validId(id))return json({received:true});
  const key="quote:"+id,quote=await env.QUOTES.get(key,{type:"json"});
  if(!quote||quote.stripe_session_id!==session.id)return json({received:true});
  if(event.type==="checkout.session.completed"&&session.payment_status!=="paid")return json({received:true});
  const paid=event.type==="checkout.session.completed"||event.type==="checkout.session.async_payment_succeeded";
  if(paid){
    if(session.amount_total!==quote.amount_minor||session.currency!==quote.currency)return json({error:"Amount mismatch"},409);
    await env.QUOTES.put(key,JSON.stringify({...quote,status:"paid",paid_at:new Date().toISOString(),stripe_payment_intent:session.payment_intent}));
  }else if(quote.status!=="paid"){
    await env.QUOTES.put(key,JSON.stringify({...quote,status:event.type==="checkout.session.expired"?"expired":"payment_failed"}));
  }
  return json({received:true});
}
export default {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==="/api/create-checkout")return request.method==="POST"?checkout(request,env,url):json({error:"Method not allowed"},405);
  if(url.pathname==="/api/stripe-webhook")return request.method==="POST"?webhook(request,env):json({error:"Method not allowed"},405);
  return env.ASSETS.fetch(request);
}};
