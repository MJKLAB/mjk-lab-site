const whatsapp='5541988347653';
const instagram='https://instagram.com/mjk.lab';
const baseProducts=[
 {id:1,name:'Chaveiro Personalizado',cat:'Chaveiros',price:'15,00',desc:'Com nome, logo, personagem, time ou tema especial.',img:'assets/produtos/chaveiro.jpg',featured:true},
 {id:2,name:'Luminária em LED 3D',cat:'Decoração',price:'79,90',desc:'Peça decorativa personalizada com iluminação.',img:'assets/produtos/luminaria.jpg',featured:true},
 {id:3,name:'Porta Copo Personalizado',cat:'Brindes',price:'29,90',desc:'Ideal para presentes, empresas e datas especiais.',img:'assets/produtos/porta-copo.jpg',featured:true},
 {id:4,name:'Lembrancinha Personalizada',cat:'Lembrancinhas',price:'8,00',desc:'Perfeita para festas, casamentos, aniversários e eventos.',img:'assets/produtos/lembrancinha.jpg',featured:false},
 {id:5,name:'Decoração Personalizada',cat:'Decoração',price:'49,90',desc:'Itens decorativos sob medida para sua ideia.',img:'assets/produtos/decoracao.jpg',featured:false},
 {id:6,name:'Organizador de Mesa',cat:'Organizadores',price:'39,90',desc:'Organizadores práticos e modernos para escritório.',img:'assets/produtos/organizador.jpg',featured:false}
];
function getProducts(){return JSON.parse(localStorage.getItem('mjk_products')||'null')||baseProducts}
function saveProducts(p){localStorage.setItem('mjk_products',JSON.stringify(p))}
function wa(text){return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`}
function renderProducts(filter='Todos',term=''){
 const el=document.querySelector('#products'); if(!el) return; const products=getProducts().filter(p=>(filter==='Todos'||p.cat===filter)&&p.name.toLowerCase().includes(term.toLowerCase()));
 el.innerHTML=products.map(p=>`<article class="product"><img src="${p.img}" alt="${p.name}"><div class="body"><h3>${p.name}</h3><p>${p.desc}</p><div>A partir de</div><div class="price">R$ ${p.price}</div><a class="btn" href="${wa('Olá! Quero orçamento do produto: '+p.name)}" target="_blank">Pedir orçamento</a><button class="btn out" onclick='details(${p.id})'>Ver detalhes</button></div></article>`).join('')||'<p>Nenhum produto encontrado.</p>';
}
function details(id){const p=getProducts().find(x=>x.id===id); const m=document.querySelector('#modal'); if(!p||!m)return; m.innerHTML=`<div class="modal-box"><button class="close" onclick="document.querySelector('#modal').classList.remove('show')">Fechar</button><img src="${p.img}"><h2>${p.name}</h2><p>${p.desc}</p><h3 class="red">A partir de R$ ${p.price}</h3><a class="btn" target="_blank" href="${wa('Olá! Vi no site e quero orçamento de: '+p.name)}">Solicitar pelo WhatsApp</a></div>`; m.classList.add('show')}
document.addEventListener('DOMContentLoaded',()=>{
 renderProducts();
 document.querySelectorAll('.cat').forEach(b=>b.onclick=()=>{document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.cat,document.querySelector('#search')?.value||'')});
 document.querySelector('#search')?.addEventListener('input',e=>{const active=document.querySelector('.cat.active')?.dataset.cat||'Todos';renderProducts(active,e.target.value)});
 document.querySelectorAll('[data-wa]').forEach(a=>a.href=wa(a.dataset.wa));
 document.querySelectorAll('[data-insta]').forEach(a=>a.href=instagram);
});
