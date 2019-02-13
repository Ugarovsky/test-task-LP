const shopList = document.getElementById("shop-list");
//default values ​​for further monipulation
let lastId = 0;
let pickedShopID;

window.onload = function () {
    renderShopList();
};

function slideUp(element){
    $(element).slideUp("fast");
}

function slideDown(element){
    $(element).slideDown("fast");
}

function renderShopList() {
    cleanSpace("shop-list");
   //show all list of stores
    for (i = 0; i < shops.length; i++) {
    const aboutShop = shops[i].shopInfo;
    let blockID = i + 1;
    shopList.innerHTML += `<div class="col-lg-3" id="${blockID}" onclick="pickThisShop(this.id)"><div class="some-item"><p class="text-center no-margin"> <img src="${aboutShop.image}" width="80%"> </p><strong>${aboutShop.name}</strong><p>${aboutShop.located}</p><p>${aboutShop.description}</p><p>${aboutShop.workTime}</p><div class="tools"><img src="image/paint-brush.png" onclick="openShopSettings()"></div></div></div>`;
    }
}

function cleanSpace(element){
    var ClearList = document.getElementById(element);
    try {
        if (ClearList.firstChild != null) {
            var fc = ClearList.firstChild;
            {
                while (fc) {
                    ClearList.removeChild(fc);
                    fc = ClearList.firstChild;
                }
            }
        }
}
catch{}
}

function closeSettingPanel(){
    slideUp("#shop-settings");
}

function saveThisSettings(){
    const pickedShop = shops[pickedShopID-1].shopInfo;
    pickedShop.name = document.getElementById("shop-new-name").value;
    pickedShop.image = document.getElementById("shop-new-logo").value;
    pickedShop.description = document.getElementById("shop-new-description").value ;
    pickedShop.located = document.getElementById("shop-new-located").value;
    pickedShop.workTime = document.getElementById("shop-new-work-time").value;
   if(renderShopValidate(document.getElementById("shop-new-name").value, document.getElementById("shop-new-logo").value,  document.getElementById("shop-new-description").value, document.getElementById("shop-new-located").value,document.getElementById("shop-new-work-time").value) == true){
    //Да нормально))
    renderShopList();
    closeSettingPanel()
   }
}

function openShopSettings(){
   try{ 
    const pickedShop = shops[pickedShopID-1].shopInfo;
   $("#shop-settings").slideDown("fast");
   document.getElementById("shop-new-name").value =  pickedShop.name;
   document.getElementById("shop-new-logo").value =  pickedShop.image;
   document.getElementById("shop-new-description").value =  pickedShop.description;
   document.getElementById("shop-new-located").value = pickedShop.located;
   document.getElementById("shop-new-work-time").value = pickedShop.workTime;
   }
   catch{};
}

$("#add-new-shop").on("click", function () {
    slideDown("#render-new-shop");
});

function renderСancel() {
    slideUp("#render-new-shop");
}

function renderStart() {
    const newShopName = document.getElementById("shop-name").value;
    const newShopLogo = document.getElementById("shop-logo").value;
    const newShopDescription = document.getElementById("shop-description").value;
    const newShopLocated = document.getElementById("shop-located").value;
    const newShopWorkTime = document.getElementById("shop-work-time").value;
    if(renderShopValidate(newShopName, newShopLogo, newShopDescription, newShopLocated,newShopWorkTime) == true){
        showNewShop(newShopName, newShopLogo, newShopDescription, newShopLocated,newShopWorkTime);
    }
    else{
        return false;
    }
}

function renderShopValidate(newShopName, newShopLogo, newShopDescription, newShopLocated,newShopWorkTime){
 if (!newShopName || !newShopLogo || !newShopDescription || !newShopLocated || !newShopWorkTime){
     alert("Заполните пожалуйста все поля!");
     return false;
 }
 else{
    return true;
 }
}

function showNewShop(name, logo, description, located, workTime) {
    pushNewSHop(name, logo, description, located);
    shopList.innerHTML += `<div class="col-lg-3" id="${lastId}" onclick="pickThisShop(this.id) "><div class="some-item"><p class="text-center no-margin"> <img src="${logo}" width="80%"> </p><strong>${name}</strong><p>${located}</p><p>${description}</p><p>${workTime}</p><div class="tools"><img src="image/paint-brush.png" onclick="openShopSettings()"></div></div></div>`;
    slideUp("#render-new-shop");
}


function pushNewSHop(name, logo, description, located) {
//get the greatest shop Id and then use it for the new shop
    lastId = () => {
        for (i = 0; i < shops.length; i++) {
            lastId = shops[i].id;
            if (lastId < shops[i].id) {
                lastId = shops[i].id;
            }
        }
        return ++lastId;
    };
 //create new shop's stucture
    const newShopInfo = {
        id: lastId(),
        shopInfo: {
            name: name,
            description: description,
            located: located,
            image: logo
        },
        products : [
            
        ]
    }
    shops.push(newShopInfo);
}
//use free api from Yandex
//https://tech.yandex.com/maps/ for more information
function mapInit() {
    var shopIndex = pickedShopID - 1;
    console.log(shopIndex);
    var myGeocoder = ymaps.geocode(shops[shopIndex].shopInfo.located, { results: 1 }).then(
        function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            var cords = firstGeoObject.geometry.getCoordinates();
            var myMap = new ymaps.Map("maping-plus", {
                center: [cords[0] , cords[1]],
                zoom: 16
            });
            myMap.geoObjects.add(new ymaps.Placemark([cords[0], cords[1]], {
            }, {
                preset: 'islands#icon',
                iconColor: '#0095b6'
            }))
        },
        function (err) {
            alert('Яндекс карты не прогрузились. Должна помочь перезагрузка страницы!');
        }
    );
}

function getMyMap() {
    var myMap = document.querySelector("#maping-plus");
    var mapTitle = document.getElementById("maping-title");
    cleanSpace("maping-plus");
    if (myMap != null) {
        myMap.id = "maping";
    }
    if (mapTitle != null) {
        mapTitle.id = "maping-title-hidden";
    }
    var myMap = document.querySelector("#maping");
    var mapTitle = document.getElementById("maping-title-hidden");
    myMap.id = "maping-plus";
    mapTitle.id = "maping-title";
    mapInit();
}

//step by step what happens when we click on the store
function pickThisShop(shopID) {
    pickedShopID = shopID;
    var currentShop = shops[shopID - 1].products;
    try {
        slideDown(".search");
        updateProductsTableView(currentShop, true);
    }
    catch{}
    getMyMap();
}

function updateProductsTableView(products, cleanSortFields) {
    if (cleanSortFields) {
        sortFields = [];
    }
    if (products) {
        //get the product table of the selected store 
        renderProductsTableTitle(products);
        updateProductsTableHeadView();
        updateProductsTableBodyView(products);
    }
    else {
        var element = document.getElementById('products-table-body');
        element.innerHTML = "";
        var element = document.getElementById('products-header-title');
        element.innerHTML = "Не найдено продуктов";
    }
}

function updateProductsTableHeadView() {
    displayOrders = sortFields.map(function (field) {
        return {
            name: field.name,
            viewOrder: field.isDescending ? '↓' : '↑'
        };
    })
    var productsViewOrder = displayOrders.find((field) => { return field.name == 'name' });
    var unitPriceViewOrder = displayOrders.find((field) => { return field.name == 'price' });
    var quantityViewOrder = displayOrders.find((field) => { return field.name == 'quantity' })
    var element = document.getElementById('products-table-head');
    var productTools = document.getElementById('product-tools');
    element.innerHTML = `
        <tr>
        <td class="header-item" onClick="sortProducts('id', currentOrderId)">
                id ${(productsViewOrder ? productsViewOrder.viewOrder : '')}
            </td>
            <td class="header-item" onClick="sortProducts('name', currentOrderId)">
                Наименование ${(productsViewOrder ? productsViewOrder.viewOrder : '')}
            </td>
            <td class="header-item" onClick="sortProducts('price', currentOrderId)">
                Цена ${(unitPriceViewOrder ? unitPriceViewOrder.viewOrder : '')}
            </td>
            <td class="header-item" onClick="sortProducts('quantity', currentOrderId)">
                Описание ${(quantityViewOrder ? quantityViewOrder.viewOrder : '')}
            </td>
        </tr>`;
        productTools.innerHTML = `
        <button class="render-button" onclick="addSomeProduct()">Добавить новый продукт </button>
        <button class="render-button" onclick="changeSomeProduct()">Изменить продукт из списка</button>
        `;
}

//get all params from the picked product
function changePickedProduct(){
    const productId = document.getElementById("product-id").value;
    const newName = document.getElementById("change-product-name").value;
    const newCount = document.getElementById("change-product-count").value;
    const newPrice = document.getElementById("change-product-price").value;
    const newproductDescription = document.getElementById("change-product-productDescription").value;
    try{
    renderChangedProduct(productId,newName,newCount,newPrice,newproductDescription);
    }
    catch{
        alert("Продукта с таким id не существует");
    }
}

function renderChangedProduct(productId,newName,newCount,newPrice,newproductDescription){
    let pickedProduct  = shops[pickedShopID -1].products[productId -1];

    pickedProduct.id = productId;
    pickedProduct.name = newName;
    pickedProduct.price = newPrice;
    pickedProduct.quantity = newCount;
    pickedProduct.productDescription = newproductDescription;
    
    if(newProductValidate(newName,newCount,newPrice,newproductDescription)){
    var currentShop = shops[pickedShopID-1].products;
    updateProductsTableView(currentShop, true);
    slideUp('#change-some-product');
    }
    else {
        alert("Заполните все поля правильно!");
    }
}

//view swiches 
function addSomeProduct(){ 
    slideUp("#change-some-product");
    slideDown("#add-new-product");
}

function renderNewProduct(){
    const newProductName = document.getElementById("new-product-name").value;
    const newProductPrice = document.getElementById("new-product-price").value;
    const newProductCount = document.getElementById("new-product-count").value;
    const newProductproductDescription = document.getElementById("new-product-productDescription").value;
    if(newProductValidate(newProductName,newProductPrice,newProductCount,newProductproductDescription)){
    pushNewProduct(newProductName,newProductPrice,newProductCount,newProductproductDescription);
   slideUp("#add-new-product");
    }
    else {
        alert("Заполните все поля!");
    }
}

function newProductValidate(newProductName,newProductPrice,newProductCount,newProductproductDescription){
 if (!newProductName || !newProductPrice || !newProductCount || !newProductproductDescription){
     return false;
 }
 else {
     return true;
 }
}

function pushNewProduct(newProductName,newProductPrice,newProductCount,newProductproductDescription){

    let newProduct = {
        id : getLastProductID(),
        name : newProductName,
        price : newProductPrice,
        quantity : newProductCount,
        productDescription : newProductproductDescription
    }

    var currentShop = shops[pickedShopID-1].products;
    currentShop.push(newProduct);
    slideUp("#add-new-product");
    updateProductsTableView(currentShop, true);
}

function getLastProductID(){
    let lastProductId = 0;
    const nowProductList = shops[pickedShopID-1].products;
    for (i=0; i < nowProductList.length; i++){
        console.log(nowProductList[i].id);
        if (lastProductId < nowProductList[i].id){
            lastProductId = nowProductList[i].id
        }
    }
    return +lastProductId + 1;
}

function changeSomeProduct() {
    slideUp('#add-new-product');
    slideDown('#change-some-product');
}

function updateProductsTableBodyView(products) {
    var element = document.getElementById('products-table-body');
    element.innerHTML = '';
    products.forEach(function (product) {
        element.innerHTML += "<td> <strong>" + product.id + "<td><strong>" + product.name + "</strong> <td> <strong> " + product.price + "</strong> " + product.productDescription + "<td> <strong> " + product.quantity + "</strong>";
    });
}

function renderProductsTableTitle(products) {
    var element = document.getElementById('products-header-title');
    element.innerHTML = `Найдено товаров магазина ${shops[pickedShopID - 1].shopInfo.name}: ` + products.length;
}

function searchForProduct() {
    var userInput = document.getElementById('products-search-area').value.toLowerCase();
    if (userInput) {
        var products = shops[pickedShopID - 1].products;
        var filteredProducts = userInput == ''
            ? products
            : products.filter(function (product) {
                var result = false;
                var keys = Object.keys(product);
                keys.forEach(function (key) {
                    return result = result || product[key].toLowerCase().indexOf(userInput) >= 0
                });
                return result;
            });
        updateProductsTableView(filteredProducts);
    }
    else {
        refreshProductSearch();
    }
}

function refreshProductSearch() {
    document.getElementById('products-search-area').value = '';
    var products = shops[pickedShopID - 1].products;
    updateProductsTableView(products);
}
