const WHATSAPP = '5541988347653';
const STORAGE_KEY = 'mjkProdutosV3';

const padrao = [
 {id:1,nome:'Chaveiro Copa do Mundo',preco:'15,00',categoria:'Copa do Mundo',descricao:'Chaveiro temático da Copa do Mundo feito em impressão 3D. Leve, resistente e ideal para torcedores.',imagem:'⚽',shopee:'',mercadolivre:'',linkExtra:''},
 {id:2,nome:'Chaveiro Personalizado',preco:'15,00',categoria:'Chaveiros',descricao:'Com nome, logo, personagem, time ou tema especial.',imagem:'🔑',shopee:'',mercadolivre:'',linkExtra:''},
 {id:3,nome:'Luminária em LED 3D',preco:'79,90',categoria:'Luminárias',descricao:'Peça decorativa personalizada com iluminação, perfeita para presentes e decoração.',imagem:'💡',shopee:'',mercadolivre:'',linkExtra:''},
 {id:4,nome:'Porta Copo Personalizado',preco:'29,90',categoria:'Brindes',descricao:'Ideal para presentes, empresas, eventos e datas especiais.',imagem:'🥤',shopee:'',mercadolivre:'',linkExtra:''},
 {id:5,nome:'Lembrancinha Personalizada',preco:'8,00',categoria:'Lembrancinhas',descricao:'Para festas, casamentos, empresas, aniversários e eventos.',imagem:'🎁',shopee:'',mercadolivre:'',linkExtra:''},
 {id:6,nome:'Topo de Bolo 3D',preco:'25,00',categoria:'Topos de bolo',descricao:'Topo personalizado com nome, idade e tema da festa.',imagem:'🎂',shopee:'',mercadolivre:'',linkExtra:''},
 {id:7,nome:'Decoração Personalizada',preco:'49,90',categoria:'Decoração',descricao:'Itens decorativos sob medida para casa, quarto, escritório ou loja.',imagem:'🏠',shopee:'',mercadolivre:'',linkExtra:''},
 {id:8,nome:'Item Geek Personalizado',preco:'35,00',categoria:'Geek',descricao:'Peças inspiradas em games, filmes, animes, personagens e cultura geek.',imagem:'🎮',shopee:'',mercadolivre:'',linkExtra:''}
];

let produtos = carregarProdutos();
let filtro = 'Todos';
const $ = id => document.getElementById(id);

function carregarProdutos(){
  try{
    const salvos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(Array.isArray(salvos) && salvos.length){
      return salvos.map(normalizarProduto);
    }
  }catch(e){console.warn('Erro ao carregar produtos:', e)}
  return padrao;
}

function normalizarProduto(p){
  return {
    id: p.id || Date.now(),
    nome: p.nome || 'Produto sem nome',
    preco: p.preco || '0,00',
    categoria: p.categoria || 'Personalizados',
    descricao: p.descricao || '',
    imagem: p.imagem || '📦',
    shopee: p.shopee || '',
    mercadolivre: p.mercadolivre || p.mercadoLivre || '',
    linkExtra: p.linkExtra || p.link || ''
  }
}

function salvar(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

function cats(){
  return ['Todos', ...new Set(produtos.map(p => p.categoria).filter(Boolean))];
}

function linkSeguro(url){
  if(!url) return '';
  const limpo = String(url).trim();
  if(!limpo) return '';
  if(limpo.startsWith('http://') || limpo.startsWith('https://')) return limpo;
  return 'https://' + limpo;
}

function renderFiltros(){
  const filtros = $('filtros');
  if(!filtros) return;
  filtros.innerHTML = cats().map(c => `<button class="${c===filtro?'ativo':''}" onclick="setFiltro('${escapeAttr(c)}')">${c}</button>`).join('');
}

function escapeHTML(str){
  return String(str ?? '').replace(/[&<>'"]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[t]));
}

function escapeAttr(str){
  return String(str ?? '').replace(/'/g, "\\'");
}

function renderImagem(valor){
  const img = (valor || '📦').trim();
  if(img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image')){
    return `<img src="${escapeHTML(img)}" alt="Produto MJK LAB" loading="lazy">`;
  }
  return escapeHTML(img || '📦');
}

function atualizarPreviewImagem(valor){
  const preview = $('previewImagem');
  if(!preview) return;
  const v = (valor || '').trim();
  if(!v){
    preview.innerHTML = 'Prévia da imagem';
    preview.classList.remove('comImagem');
    return;
  }
  preview.innerHTML = renderImagem(v);
  preview.classList.add('comImagem');
}

function redimensionarImagem(file, maxSize = 900, qualidade = 0.82){
  return new Promise((resolve, reject) => {
    if(!file || !file.type.startsWith('image/')){
      reject(new Error('Escolha um arquivo de imagem.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let {width, height} = img;
        if(width > height && width > maxSize){
          height = Math.round(height * (maxSize / width));
          width = maxSize;
        }else if(height >= width && height > maxSize){
          width = Math.round(width * (maxSize / height));
          height = maxSize;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', qualidade));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function botoesProduto(p){
  const shopee = linkSeguro(p.shopee);
  const ml = linkSeguro(p.mercadolivre);
  const extra = linkSeguro(p.linkExtra);
  const msg = encodeURIComponent(`Olá! Tenho interesse em ${p.nome} da MJK LAB.`);
  return `
    <div class="botoes">
      ${shopee ? `<a class="shopee" href="${shopee}" target="_blank" rel="noopener">Comprar na Shopee</a>` : ''}
      ${ml ? `<a class="ml" href="${ml}" target="_blank" rel="noopener">Mercado Livre</a>` : ''}
      ${extra ? `<a class="extra" href="${extra}" target="_blank" rel="noopener">Ver anúncio</a>` : ''}
      <a class="whats" href="https://wa.me/${WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Pedir pelo WhatsApp</a>
      <div class="adminBtns">
        <button class="edit" onclick="editar(${p.id})">Editar</button>
        <button class="del" onclick="excluir(${p.id})">Excluir</button>
      </div>
    </div>`;
}

function render(){
  renderFiltros();
  const busca = ($('busca')?.value || '').toLowerCase().trim();
  const lista = produtos.filter(p => {
    const texto = `${p.nome} ${p.descricao} ${p.categoria}`.toLowerCase();
    return (filtro === 'Todos' || p.categoria === filtro) && texto.includes(busca);
  });

  const contador = $('contadorProdutos');
  if(contador) contador.textContent = produtos.length;

  const area = $('listaProdutos');
  if(!area) return;
  area.innerHTML = lista.map(p => `
    <article class="produto">
      <div class="foto">${renderImagem(p.imagem)}</div>
      <div class="info">
        <span class="tag">${escapeHTML(p.categoria)}</span>
        <h3>${escapeHTML(p.nome)}</h3>
        <p>${escapeHTML(p.descricao)}</p>
        <span class="preco">R$ ${escapeHTML(p.preco)}</span>
        ${botoesProduto(p)}
      </div>
    </article>
  `).join('') || '<p class="empty">Nenhum produto encontrado.</p>';
}

window.setFiltro = c => { filtro = c; render(); };

window.editar = id => {
  const p = produtos.find(x => x.id === id);
  if(!p) return;
  $('produtoId').value = p.id;
  $('nome').value = p.nome;
  $('preco').value = p.preco;
  $('categoria').value = p.categoria;
  $('descricao').value = p.descricao;
  $('imagem').value = p.imagem;
  atualizarPreviewImagem(p.imagem);
  const up = $('uploadImagem'); if(up) up.value = '';
  $('shopee').value = p.shopee || '';
  $('mercadolivre').value = p.mercadolivre || '';
  $('linkExtra').value = p.linkExtra || '';
  location.hash = 'painel';
  $('nome').focus();
};

window.excluir = id => {
  if(confirm('Excluir este produto?')){
    produtos = produtos.filter(p => p.id !== id);
    salvar();
    render();
  }
};

function limparForm(){
  $('formProduto').reset();
  $('produtoId').value = '';
  atualizarPreviewImagem('');
}

$('formProduto')?.addEventListener('submit', e => {
  e.preventDefault();
  const id = $('produtoId').value;
  const p = normalizarProduto({
    id: id ? Number(id) : Date.now(),
    nome: $('nome').value,
    preco: $('preco').value,
    categoria: $('categoria').value,
    descricao: $('descricao').value,
    imagem: $('imagem').value || '📦',
    shopee: $('shopee').value,
    mercadolivre: $('mercadolivre').value,
    linkExtra: $('linkExtra').value
  });

  if(id){
    produtos = produtos.map(x => x.id === Number(id) ? p : x);
  }else{
    produtos.unshift(p);
  }
  salvar();
  limparForm();
  render();
  location.hash = 'produtos';
});

$('limpar')?.addEventListener('click', limparForm);
$('busca')?.addEventListener('input', render);

$('imagem')?.addEventListener('input', e => atualizarPreviewImagem(e.target.value));

$('uploadImagem')?.addEventListener('change', async e => {
  const file = e.target.files[0];
  if(!file) return;
  try{
    const dataUrl = await redimensionarImagem(file);
    $('imagem').value = dataUrl;
    atualizarPreviewImagem(dataUrl);
  }catch(err){
    alert('Não foi possível carregar esta imagem. Tente outra foto.');
  }
});

$('exportar')?.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(produtos, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'backup-produtos-mjk-lab.json';
  a.click();
  URL.revokeObjectURL(url);
});

$('importar')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const dados = JSON.parse(reader.result);
      if(!Array.isArray(dados)) throw new Error('Arquivo inválido');
      produtos = dados.map(normalizarProduto);
      salvar();
      render();
      alert('Produtos importados com sucesso!');
    }catch(err){
      alert('Não foi possível importar o arquivo.');
    }
  };
  reader.readAsText(file);
});

$('topBtn')?.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));
window.addEventListener('scroll', () => {
  const btn = $('topBtn');
  if(btn) btn.style.display = scrollY > 500 ? 'block' : 'none';
});

salvar();
render();
