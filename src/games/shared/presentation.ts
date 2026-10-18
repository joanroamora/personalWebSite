export const clock=(seconds:number)=>`${Math.floor(Math.max(0,seconds)/60)}:${String(Math.floor(Math.max(0,seconds)%60)).padStart(2,'0')}`;
export function text(root:HTMLElement,selector:string,value:string):void {
  const node=root.querySelector<HTMLElement>(selector);
  if(node&&node.textContent!==value)node.textContent=value;
}
export function button(root:HTMLElement,selector:string,disabled:boolean,label?:string):void {
  const node=root.querySelector<HTMLButtonElement>(selector);
  if(!node)return;node.disabled=disabled;
  if(label&&node.textContent!==label)node.textContent=label;
}
