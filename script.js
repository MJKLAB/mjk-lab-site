const baseProdutos=[
{id:1,nome:'Chaveiro Personalizado',preco:'15,00',categoria:'Chaveiros',descricao:'Com nome, logo, personagem, time ou tema especial.',emoji:'🔑'},
{id:2,nome:'Luminária em LED 3D',preco:'79,90',categoria:'Decoração',descricao:'Peça decorativa personalizada com iluminação.',emoji:'💡'},
{id:3,nome:'Porta Copo Personalizado',preco:'29,90',categoria:'Brindes',descricao:'Ideal para presentes, empresas e datas especiais.',emoji:'🥤'},
{id:4,nome:'Lembrancinha Personalizada',preco:'8,00',categoria:'Lembrancinhas',descricao:'Ótima para festas, eventos, casamentos e aniversários.',emoji:'🎁'},
{id:5,nome:'Decoração Personalizada',preco:'49,90',categoria:'Decoração',descricao:'Peças decorativas sob medida para sua ideia.',emoji:'🏠'},
{id:6,nome:'Organizador de Mesa',preco:'39,90',categoria:'Organizadores',descricao:'Organizadores úteis e personalizados para escritório.',emoji:'🖊️'},
{id:7,nome:'Brinde para Empresas',preco:'12,00',categoria:'Empresas',descricao:'Produtos personalizados com logo para clientes e equipe.',emoji:'🏢'},
{id:8,nome:'Item Geek 3D',preco:'25,00',categoria:'Geek',descricao:'Produtos personalizados para fãs, jogos e colecionáveis.',emoji:'🎮'}
];
let produtos=JSON.parse(localStorage.getItem('mjkProdutos')||'null')||baseProdutos;
let categoriaAtual='Todos';
const lista=document.getElementById('listaProdutos'), cats=document.getElementById('categorias'), busca=document.getElementById('busca');
function salvar(){localStorage.setItem('mjkProdutos',JSON.stringify(produtos))}
function categorias(){const arr=['Todos',...new Set(produtos.map(p=>p.categoria))];cats.innerHTML=arr.map(c=>`<button class="${c===categoriaAtual?'ativo':''}" onclick="filtrar('${c}')">${c}</button>`).join('')}
function filtrar(c){categoriaAtual=c;render()}
function render(){categorias();const termo=(busca.value||'').toLowerCase();const filtrados=produtos.filter(p=>(categoriaAtual==='Todos'||p.categoria===categoriaAtual)&&(p.nome.toLowerCase().includes(termo)||p.descricao.toLowerCase().includes(termo)||p.categoria.toLowerCase().includes(termo)));lista.innerHTML=filtrados.map(p=>`<article class="produto"><div class="foto">${p.imagem?`<img src="${p.imagem}" alt="${p.nome}">`:`<span class="emoji">${p.emoji||'🧩'}</span>`}</div><div class="info"><h3>${p.nome}</h3><p>${p.descricao}</p><span class="preco">R$ ${p.preco}</span><div class="acoes"><a class="btn" target="_blank" href="https://wa.me/5541988347653?text=${encodeURIComponent('Olá! Tenho interesse no produto: '+p.nome)}">Orçamento</a><button onclick="editar(${p.id})">Editar</button><button onclick="excluir(${p.id})">Excluir</button></div></div></article>`).join('')||'<p>Nenhum produto encontrado.</p>'}
busca.addEventListener('input',render);
document.getElementById('formProduto').addEventListener('submit',e=>{e.preventDefault();const id=document.getElementById('editId').value;const dados={id:id?Number(id):Date.now(),nome:nome.value,preco:preco.value,categoria:categoria.value,descricao:descricao.value};const file=imagem.files[0];function concluir(img){if(img)dados.imagem=img;else if(id){const ant=produtos.find(p=>p.id==id); if(ant&&ant.imagem)dados.imagem=ant.imagem} if(id)produtos=produtos.map(p=>p.id==id?dados:p); else produtos.unshift(dados); salvar();e.target.reset();editId.value='';render();location.hash='produtos'} if(file){const r=new FileReader();r.onload=()=>concluir(r.result);r.readAsDataURL(file)}else concluir()});
function editar(id){const p=produtos.find(x=>x.id===id); if(!p)return; editId.value=p.id; nome.value=p.nome; preco.value=p.preco; categoria.value=p.categoria; descricao.value=p.descricao; location.hash='painel'}
function excluir(id){if(confirm('Excluir este produto?')){produtos=produtos.filter(p=>p.id!==id);salvar();render()}}
document.getElementById('limpar').onclick=()=>{formProduto.reset();editId.value=''};
render();
