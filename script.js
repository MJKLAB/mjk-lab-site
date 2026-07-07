const padrao = [
 {id:1,nome:'Chaveiro Personalizado',preco:'15,00',categoria:'Chaveiros',descricao:'Com nome, logo, personagem, time ou tema especial.',imagem:'🔑'},
 {id:2,nome:'Luminária em LED 3D',preco:'79,90',categoria:'Luminárias',descricao:'Peça decorativa personalizada com iluminação.',imagem:'💡'},
 {id:3,nome:'Porta Copo Personalizado',preco:'29,90',categoria:'Brindes',descricao:'Ideal para presentes, empresas e datas especiais.',imagem:'🥤'},
 {id:4,nome:'Lembrancinha Personalizada',preco:'8,00',categoria:'Lembrancinhas',descricao:'Para festas, casamentos, empresas e eventos.',imagem:'🎁'},
 {id:5,nome:'Decoração Personalizada',preco:'49,90',categoria:'Decoração',descricao:'Itens decorativos sob medida para sua casa ou negócio.',imagem:'🏠'},
 {id:6,nome:'Organizador de Mesa',preco:'39,90',categoria:'Empresas',descricao:'Organizadores úteis para escritório, loja ou bancada.',imagem:'🖊️'},
 {id:7,nome:'Topo de Bolo 3D',preco:'25,00',categoria:'Decoração',descricao:'Topo personalizado com nome, idade e tema da festa.',imagem:'🎂'},
 {id:8,nome:'Item Geek Personalizado',preco:'35,00',categoria:'Geek',descricao:'Peças inspiradas em games, filmes, animes e personagens.',imagem:'🎮'}
];
let produtos = JSON.parse(localStorage.getItem('mjkProdutosV3')) || padrao;
let filtro = 'Todos';
const $ = id => document.getElementById(id);
function salvar(){localStorage.setItem('mjkProdutosV3',JSON.stringify(produtos))}
function cats(){return ['Todos',...new Set(produtos.map(p=>p.categoria))]}
function renderFiltros(){ $('filtros').innerHTML = cats().map(c=>`<button class="${c===filtro?'ativo':''}" onclick="setFiltro('${c}')">${c}</button>`).join('') }
window.setFiltro = c => {filtro=c; render()}
function render(){
 renderFiltros();
 const busca = ($('busca')?.value||'').toLowerCase();
 const lista = produtos.filter(p=>(filtro==='Todos'||p.categoria===filtro) && (p.nome.toLowerCase().includes(busca)||p.descricao.toLowerCase().includes(busca)||p.categoria.toLowerCase().includes(busca)));
 $('listaProdutos').innerHTML = lista.map(p=>`<article class="produto"><div class="foto">${p.imagem && p.imagem.startsWith('http')?`<img src="${p.imagem}" style="width:100%;height:100%;object-fit:cover">`:p.imagem||'📦'}</div><div class="info"><h3>${p.nome}</h3><p>${p.descricao}</p><span class="preco">R$ ${p.preco}</span><div class="botoes"><a href="https://wa.me/5541988347653?text=Olá!%20Tenho%20interesse%20em%20${encodeURIComponent(p.nome)}" target="_blank">Orçamento</a><button class="edit" onclick="editar(${p.id})">Editar</button><button class="del" onclick="excluir(${p.id})">Excluir</button></div></div></article>`).join('') || '<p>Nenhum produto encontrado.</p>';
}
window.editar = id => { const p=produtos.find(x=>x.id===id); if(!p)return; $('produtoId').value=p.id; $('nome').value=p.nome; $('preco').value=p.preco; $('categoria').value=p.categoria; $('descricao').value=p.descricao; $('imagem').value=p.imagem; location.hash='painel'; }
window.excluir = id => { if(confirm('Excluir este produto?')){produtos=produtos.filter(p=>p.id!==id); salvar(); render();} }
$('formProduto').addEventListener('submit', e=>{e.preventDefault(); const id=$('produtoId').value; const p={id:id?Number(id):Date.now(),nome:$('nome').value,preco:$('preco').value,categoria:$('categoria').value,descricao:$('descricao').value,imagem:$('imagem').value||'📦'}; if(id){produtos=produtos.map(x=>x.id===Number(id)?p:x)}else{produtos.unshift(p)} salvar(); e.target.reset(); $('produtoId').value=''; render(); location.hash='produtos';});
$('limpar').onclick=()=>{$('formProduto').reset();$('produtoId').value=''};
$('busca').addEventListener('input',render);
render();
