$(document).ready(function(){
    console.log("Cargado con jQuery")
    traerDatos()
 });


async function traerDatos() {
    let response = await fetch("./js/api.json");
    let data = await response.json()
    productos = data
    pintarCards(data)
}


const cards = document.getElementById('cards') //me traigo el row productos
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const selectFiltro1 = document.getElementById('talles-botones')
const templateCard = document.getElementById('template-card').content //me traigo el contenido del template
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

let carrito = {}

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

selectFiltro1.addEventListener('click', e =>{
    filtrar1(e)
})

function actualizarCarrito() {
    contenedorCarrito.innerHTML=''

    carrito.forEach( (producto) => {

        const div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `
                        <p>${producto.nombre}</p>
                        <p>Precio: $${producto.precio * producto.cantidad}</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                        <button onclick=eliminarProducto(${producto.id}) class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                    `

        contenedorCarrito.appendChild(div)
    })

    contadorCarrito.innerText = carrito.length
    precioTotal.innerText = carrito.reduce( (acc, el) => acc + (el.precio * el.cantidad), 0 )
}

const pintarCards = (data) => {

    cards.innerHTML = ''

    data.forEach(producto => {
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelectorAll('a')[1].textContent = producto.title
        templateCard.querySelector('h5').textContent = producto.precio
        templateCard.querySelector('p').textContent = producto.tamaño
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)//da true si quedo un nodo bien hecho
        fragment.appendChild(clone)// fragmente hace mejor la pagina
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelectorAll('a')[1].textContent,
        precio: objeto.querySelector('h5').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad + producto.precio
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    if(e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}

if (localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
}



const filtrar1 = e => {
    let valorFiltroTamaño = e.target.id
    console.log(valorFiltroTamaño)
    
    let arrayFiltrado = []

    if (valorFiltroTamaño == 'all') {
        arrayFiltrado = productos
    } else {
        arrayFiltrado = productos.filter( el => el.tamaño == e.target.id) 
    }

    pintarCards(arrayFiltrado)
    e.stopPropagation()
}



// no andan bien los botones del carrito, sum y res
// convertir los link, en botones para filtrar // ver si fue bien resuelto
// organizar la pag, 1)productos 2)carrito 3)carrusel 4)contacto 
// hacer un modal con el carrito
// armar una parte en jquery el carrusel
// agregar los textos a las cards




// Hola Juan! El trabajo está muy bien.

// No soy fan de esta forma de encarar la lógica porque creo que se puede hacer de una forma mucho más sencilla y legible, 

// pero está bien y funciona correctamente.



// El único detalle que encuentro es en los botones de agregar y remover cantidad dentro del carrito. 

// Hay un problema con el ícono al clickear los botones: 

// si hacés click sobre el ícono el evento no se dispara, 

// pero si clickeás el borde el botón, fuera del ícono, sí funciona. 

// En otras palabras, el ícono te está bloqueando el click al botón. 

// Esto se corrige fácilmente con CSS. Tenés que seleccionar el ícono y ponerle la propiedad:

// 	pointer-events: none;



// Eso ignora los clicks sobre ese elemento y no vas a tener problema con esa interacción.



