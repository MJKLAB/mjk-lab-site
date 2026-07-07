const IMGBB_API_KEY = '04be573935c1ca9c0f5f71aac82750e8';
const SENHA_PAINEL = 'mjk123';
const STORAGE_KEY = 'mjkProdutosOnlineV6';

const padrao = [
 {id:1,nome:'Chaveiro Personalizado',preco:'15,00',categoria:'Chaveiros',descricao:'Com nome, logo, personagem, time ou tema especial.',imagem:'🔑',shopee:'',mercadolivre:''},
 {id:2,nome:'Luminária em LED 3D',preco:'79,90',categoria:'Luminárias',descricao:'Peça decorativa personalizada com iluminação.',imagem:'💡',shopee:'',mercadolivre:''},
 {id:3,nome:'Porta Copo Personalizado',preco:'29,90',categoria:'Brindes',descricao:'Ideal para presentes, empresas e datas especiais.',imagem:'🥤',shopee:'',mercadolivre:''},
 {id:4,nome:'Lembrancinha Personalizada',preco:'8,00',categoria:'Lembrancinhas',descricao:'Para festas, casamentos, empresas e eventos.',imagem:'🎁',shopee:'',mercadolivre:''},
 {id:5,nome:'Decoração Personalizada',preco:'49,90',categoria:'Decoração',descricao:'Itens decorativos sob medida para sua casa ou negócio.',imagem:'🏠',shopee:'',mercadolivre:''},
 {id:6,nome:'Organizador de Mesa',preco:'39,90',categoria:'Empresas',descricao:'Organizadores úteis para escritório, loja ou bancada.',imagem:'🖊️',shopee:'',mercadolivre:''},
 {id:7,nome:'Topo de Bolo 3D',preco:'25,00',categoria:'Topo de bolo',descricao:'Topo personalizado com nome, idade e tema da festa.',imagem:'🎂',shopee:'',mercadolivre:''},
 {id:8,nome:'Item Geek Personalizado',preco:'35,00',categoria:'Geek',descricao:'Peças inspiradas em games, filmes, animes e personagens.',imagem:'🎮',shopee:'',mercadolivre:''}
];

let produtos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || padrao;
let filtro = 'Todos';
const $ = id => document.getElementById(id);
const isAdmin = location.pathname.includes('admin.html');

function salvarLocal(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos)); }
function cats(){ return ['Todos', ...new Set(produtos.map(p => p.categoria).filter(Boolean))]; }
function isUrl(v){ return typeof v === 'string' && /^https?:\/\//i.test(v); }
function imgHtml(valor){
  if(!valor) return '📦';
  if(isUrl(valor)) return `<img src="${valor}" alt="Produto">`;
  if(/\.(jpg|jpeg|png|gif|webp)$/i.test(valor)) return `<img src="${valor}" alt="Produto">`;
  return valor;
}
function linkWhats(p){ return `https://wa.me/5541988347653?text=${encodeURIComponent('Olá! Tenho interesse em ' + p.nome)}`; }

function renderFiltros(){
  const el = $('filtros');
  if(!el) return;
  el.innerHTML = cats().map(c => `<button class="${c===filtro?'ativo':''}" onclick="setFiltro('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('');
}
window.setFiltro = c => { filtro=c; render(); };

function render(){
  renderFiltros();
  const listaEl = $('listaProdutos');
  if(listaEl){
    const busca = ($('busca')?.value || '').toLowerCase();
    const lista = produtos.filter(p =>
      (filtro === 'Todos' || p.categoria === filtro) &&
      ((p.nome||'').toLowerCase().includes(busca) || (p.descricao||'').toLowerCase().includes(busca) || (p.categoria||'').toLowerCase().includes(busca))
    );
    listaEl.innerHTML = lista.map(p => `<article class="produto">
      <div class="foto">${imgHtml(p.imagem)}</div>
      <div class="info">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <span class="preco">R$ ${p.preco}</span>
        <div class="botoes">
          ${p.shopee ? `<a href="${p.shopee}" target="_blank">Comprar na Shopee</a>` : ''}
          ${p.mercadolivre ? `<a class="ml" href="${p.mercadolivre}" target="_blank">Mercado Livre</a>` : ''}
          <a class="wa" href="${linkWhats(p)}" target="_blank">WhatsApp</a>
        </div>
      </div>
    </article>`).join('') || '<p>Nenhum produto encontrado.</p>';
  }
  renderGaleria();
  renderAdminLista();
}

function renderGaleria(){
  const g = $('galeriaGrid');
  if(!g) return;
  g.innerHTML = produtos.slice(0,8).map(p => `<div>${imgHtml(p.imagem)}</div>`).join('');
}

async function uploadImgBB(file){
  const status = $('uploadStatus');
  if(!file) return null;
  if(status) status.textContent = 'Enviando imagem para o ImgBB...';
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method:'POST', body: form });
  const data = await res.json();
  if(!data.success) throw new Error(data?.error?.message || 'Erro ao enviar imagem');
  return data.data.url;
}

function setupAdmin(){
  if(!isAdmin) return;
  const loginBox = $('loginBox'), adminArea = $('adminArea');
  const logged = sessionStorage.getItem('mjkAdmin') === 'ok';
  if(logged){ loginBox?.classList.add('escondido'); adminArea?.classList.remove('escondido'); }
  $('entrarPainel')?.addEventListener('click', () => {
    if(($('senhaPainel').value || '') === SENHA_PAINEL){
      sessionStorage.setItem('mjkAdmin','ok');
      loginBox.classList.add('escondido'); adminArea.classList.remove('escondido');
      render();
    } else alert('Senha incorreta.');
  });

  $('imagemArquivo')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if(!file) return;
    try{
      const url = await uploadImgBB(file);
      $('imagem').value = url;
      $('imagemManual').value = url;
      $('uploadStatus').textContent = 'Imagem enviada com sucesso!';
      $('previewImagem').innerHTML = `<img src="${url}" alt="Prévia">`;
    }catch(err){
      $('uploadStatus').innerHTML = `<span class="alerta">Erro: ${err.message}</span>`;
    }
  });

  $('formProduto')?.addEventListener('submit', e => {
    e.preventDefault();
    const id = $('produtoId').value;
    const imagemFinal = $('imagem').value || $('imagemManual').value || '📦';
    const p = {
      id: id ? Number(id) : Date.now(),
      nome: $('nome').value.trim(), preco: $('preco').value.trim(), categoria: $('categoria').value,
      descricao: $('descricao').value.trim(), imagem: imagemFinal,
      shopee: $('shopee').value.trim(), mercadolivre: $('mercadolivre').value.trim()
    };
    if(id) produtos = produtos.map(x => x.id === Number(id) ? p : x); else produtos.unshift(p);
    salvarLocal(); e.target.reset(); $('produtoId').value=''; $('imagem').value=''; $('previewImagem').innerHTML=''; $('uploadStatus').textContent='Nenhuma imagem enviada.'; render();
    alert('Produto salvo!');
  });
  $('limpar')?.addEventListener('click', () => { $('formProduto').reset(); $('produtoId').value=''; $('imagem').value=''; $('previewImagem').innerHTML=''; });
}

function renderAdminLista(){
  const el = $('adminProdutos');
  if(!el) return;
  el.innerHTML = produtos.map(p => `<div class="admin-produto">
    <div class="${isUrl(p.imagem) || /\.(jpg|jpeg|png|gif|webp)$/i.test(p.imagem||'') ? '' : 'emoji'}">${imgHtml(p.imagem)}</div>
    <div><b>${p.nome}</b><p>${p.categoria} • R$ ${p.preco}</p></div>
    <div><button class="btn outline" onclick="editar(${p.id})">Editar</button><button class="btn primary" onclick="excluir(${p.id})">Excluir</button></div>
  </div>`).join('');
}

window.editar = id => {
  const p = produtos.find(x => x.id === id); if(!p) return;
  $('produtoId').value = p.id; $('nome').value = p.nome; $('preco').value = p.preco; $('categoria').value = p.categoria; $('descricao').value = p.descricao;
  $('imagem').value = p.imagem || ''; $('imagemManual').value = p.imagem || ''; $('shopee').value = p.shopee || ''; $('mercadolivre').value = p.mercadolivre || '';
  $('previewImagem').innerHTML = p.imagem ? `<div class="foto">${imgHtml(p.imagem)}</div>` : '';
  window.scrollTo({top:0,behavior:'smooth'});
};
window.excluir = id => { if(confirm('Excluir este produto?')){ produtos = produtos.filter(p => p.id !== id); salvarLocal(); render(); } };

$('busca')?.addEventListener('input', render);
setupAdmin();
render();
