// 表单写入完成后轻微调整宿主 iframe 尺寸，令编辑器丢弃旧页面渲染缓存。
const pending=new WeakMap();
export function needsFormRefresh(name,result){return name==='form_fill' && !result?.isError;}
export function refreshFormFrame(frame,schedule=requestAnimationFrame){
 if(pending.has(frame))return pending.get(frame);
 const height=frame.getBoundingClientRect().height;
 if(height<2)return Promise.resolve();
 const previous=frame.style.height;
 const task=new Promise(resolve=>{
  frame.style.height=`${height-1}px`;
  schedule(()=>schedule(()=>{frame.style.height=previous;pending.delete(frame);resolve();}));
 });
 pending.set(frame,task);return task;
}
