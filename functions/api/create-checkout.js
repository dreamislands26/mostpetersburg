/**
 * MOST Petersburg: server-only Stripe checkout for pre-approved quotes.
 * Required bindings: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, QUOTES (KV).
 * Never accept price, currency or Stripe account details from a browser.
 */
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
const form=(obj)=>{const p=new URLSearchParams();for(const [k,v] of Object.entries(obj))p.set(k,String(v));return p};
const validId=id=>typeof id==="string"&&/^[a-zA-Z0-9_-]{8,80}$/.test(id);
export async function onRequestPost({request,env}){
  if(!env.STRIPE_SECRET_KEY||!env.QUOTES)return json({error:"Payments are not enabled yet."},503);
  const origin=new URL(request.url).origin;
  if(request.headers.get("origin")!==origin)return json({error:"Invalid origin."},403);
  let body;try{body=await request.json()}catch{return json({error:"Invalid request."},400)}
  if(!validId(body.quote_id))return json({error:"Invalid quote reference."},400);
  const quote=await env.QUOTES.get("quote:"+body.quote_id,{type:"json"});
  if(!quote||quote.status!=="approved"||!Number.isSafeInteger(quote.amount_minor)||quote.amount_minor<50||!["usd","eur","thb","sgd","gbp"].includes(quote.currency)||!quote.description)return json({error:"Quote unavailable. Please contact us."},404);
  if(quote.expires_at&&Date.now()>Date.parse(quote.expires_at))return json({error:"Quote expired."},410);
  if(quote.stripe_session_id)return json({error:"A checkout session has already been created for this quote. Contact us for the payment link."},409);
  const params=form({
    mode:"payment",success_url:origin+"/payment-result.html?status=return&session_id={CHECKOUT_SESSION_ID}",cancel_url:origin+"/payment-result.html?status=cancelled",
    "line_items[0][price_data][currency]":quote.currency,
    "line_items[0][price_data][unit_amount]":quote.amount_minor,
    "line_items[0][price_data][product_data][name]":quote.description,
    "line_items[0][quantity]":1,
    client_reference_id:body.quote_id,
    "metadata[quote_id]":body.quote_id,
    "payment_intent_data[metadata][quote_id]":body.quote_id,
    "customer_email":quote.customer_email,
  });
  if(!quote.customer_email)params.delete("customer_email");
  const response=await fetch("https://api.stripe.com/v1/checkout/sessions",{method:"POST",headers:{authorization:"Bearer "+env.STRIPE_SECRET_KEY,"content-type":"application/x-www-form-urlencoded","Idempotency-Key":"most-quote-"+body.quote_id},body:params});
  const data=await response.json();
  if(!response.ok||!data.url)return json({error:"Checkout could not be created."},502);
  await env.QUOTES.put("quote:"+body.quote_id,JSON.stringify({...quote,stripe_session_id:data.id,status:"checkout_created"}));
  return json({url:data.url});
}
