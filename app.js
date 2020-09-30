//main js file

// Storage Controller
const StorageController = (function () {

    return {
        storeProduct: function(product){
            let products;   
            if(localStorage.getItem('products')===null){
                products = [];
                products.push(product);                
            }else{
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products));
        },
        getProducts: function(){
            let products;
            if(localStorage.getItem('products')==null){
                products = [];
            }else{
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        updateProduct: function(product){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
                if(product.id == prd.id){
                    products.splice(index,1,product);
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        },
        deleteProduct: function(id){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
                if(id == prd.id){
                    products.splice(index,1);
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        }
    }

})();

// UI Controller
const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListItems: '#item-list tr',
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        cancelButton: '.cancelBtn',
        deleteButton: '.deleteBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalDolar: "#total-dolar",
        totalEuro: "#total-eu",
        totalTl: "#total-tl"
    }

    return {
        createProductList: function (products) {
            let html = "";

            products.forEach(prd => {
                html += `
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-right">
                    <i class="far fa-edit edit-product"></i>
                </td>
            </tr>
                `
            });

            $(Selectors.productList).html(html);
        },

        getSelectors: function () {
            return Selectors;
        },

        addProduct: function (prd) {

            $(Selectors.productCard).show();
            var item = `            
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                    <i class="far fa-edit edit-product"></i>
                </td>
            </tr>              
            `;

            $(Selectors.productList).append(item); /* eklene // html +=  */
        },

        updateProduct: function (prd) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });

            return updatedItem;
        },

        clearInputs: function () {
            $(Selectors.productName).val('');
            $(Selectors.productPrice).val('');
        },


        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
        },


        hideCard: function () {
            $(Selectors.productCard).hide();
        },

        showTotal: function (total) {
            fetch('https://api.exchangeratesapi.io/latest?base=USD')
            .then(response => response.json()) .then (data => {
                let euroKur = data.rates.EUR;
                let dolarKur = data.rates.TRY;
                    $(Selectors.totalDolar).text(total.toFixed(2));
                    $(Selectors.totalTl).text(parseFloat(dolarKur.toFixed(2) * total.toFixed(2)));
                    $(Selectors.totalEuro).text(parseFloat(total.toFixed(2) * euroKur.toFixed(2)));
            }).catch(error => {
                console.error('Error:',error);
            })
        },

        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            $(Selectors.productName).val(selectedProduct.name);
            $(Selectors.productPrice).val(selectedProduct.price);
        },

        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            })
        },

        addingState: function (item) {

            UIController.clearWarnings();

            UIController.clearInputs();
            $(Selectors.addButton).show();
            $(Selectors.updateButton).hide();
            $(Selectors.deleteButton).hide();
            $(Selectors.cancelButton).hide();
        },

        editState: function (tr) {

            tr.classList.add('bg-warning');
            $(Selectors.addButton).hide();
            $(Selectors.updateButton).show();
            $(Selectors.deleteButton).show();
            $(Selectors.cancelButton).show();
        }

    }

})();



// Product Controller
const ProductController = (function () {

    //private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    }

    //public
    return {

        getProducts: function () {
            return data.products;
        },

        getData: function () {
            return data;
        },

        getProductById: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })

            return product;
        },


        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },

        getCurrentProduct: function () {
            return data.selectedProduct;
        },

        addProduct: function (name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },

        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });

            return product;
        },

        deleteProduct: function (product) {
            //id nin listedeki hangi indexde olduğunu bulup splice ile silindi
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1); // indexden itibaren sil
                }
            })

        },

        getTotal: function () {
            let total = 0;

            data.products.forEach(function (item) {
                total += item.price;
            });

            data.totalPrice = total;

            return data.totalPrice;
        }
    }

})();





// App Controller
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    // Load Event Listeners
    const loadEventListeners = function () {

        // add product event
        $(UISelectors.addButton).click(productAddSubmit);

        //edit product
        $(UISelectors.productList).click(productEditSubmit);

        //edit product submit

        $(UISelectors.updateButton).click(editProductSubmit);


        //cancel button click
        $(UISelectors.cancelButton).click(cancelUpdate);


        $(UISelectors.deleteButton).click(deleteProductSubmit);
    }
    const productAddSubmit = function (e) {

        const productName = $(UISelectors.productName).val();
        const productPrice = $(UISelectors.productPrice).val();

        if (productName !== '' && productPrice !== '') {
            // Add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // add item to list
            UICtrl.addProduct(newProduct);

            //add product to local Storage
            StorageCtrl.storeProduct(newProduct);


            //get total
            const total = ProductCtrl.getTotal();

            //show  total
            UICtrl.showTotal(total);


            // clear inputs
            UICtrl.clearInputs();

        }

        console.log(productName, productPrice);

        e.preventDefault();
    }

    const productEditSubmit = function (e) {

        if (e.target.classList.contains('edit-product')) {
            const id = e.target.parentNode.previousElementSibling
                .previousElementSibling.previousElementSibling.textContent;

            // get selected product
            const product = ProductCtrl.getProductById(id);

            //set current product
            ProductCtrl.setCurrentProduct(product);

            UICtrl.clearWarnings();

            //add product to UI
            UICtrl.addProductToForm();


            UICtrl.editState(e.target.parentNode.parentNode);
        }

        e.preventDefault()
    }

    const editProductSubmit = function (e) {

        const productName = $(UISelectors.productName).val();
        const productPrice = $(UISelectors.productPrice).val();

        if (productName !== '' && productPrice !== '') {

            // update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            // update ui
            let item = UICtrl.updateProduct(updatedProduct);

            // get total
            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

            //update storage
            StorageCtrl.updateProduct(updatedProduct);


            UICtrl.addingState();

        }

        e.preventDefault();
    }


    const cancelUpdate = function (e) {

        UICtrl.addingState();

        UICtrl.clearWarnings();

        e.preventDefault();
    }


    const deleteProductSubmit = function (e) {

        //get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        //delete product
        ProductCtrl.deleteProduct(selectedProduct);

        //delete ui
        UICtrl.deleteProduct();

        //get total
        const total = ProductCtrl.getTotal();

        //show  total
        UICtrl.showTotal(total);

        //delete from storage
        StorageCtrl.deleteProduct(selectedProduct.id);

        UICtrl.addingState();

        if (id(total == 0)) {
            UICtrl.hideCard();
        }


        e.preventDefault();
    }

    return {
        init: function () {
            console.log('starting app...');

            UICtrl.addingState();

            const products = ProductCtrl.getProducts();


            if (products.length == 0) { //eleman yoksa card sakla
                UICtrl.hideCard();
            } else { //diğer durumda ürün oluşur
                UICtrl.createProductList(products);
            }

            // load event listeners
            loadEventListeners()
        }
    }

})(ProductController, UIController, StorageController);

App.init();