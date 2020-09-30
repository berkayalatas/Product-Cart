// UI Controller
const UIController = (function(){

    const Selectors = {
        productList: "#item-list",
        addButton: '.addBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalDolar:"#total-dolar",
        totalEuro:"#total-eu",
        totalTl:"#total-tl"
    }

    return {
        createProductList :function(products){
            let html="";

            products.forEach(prd => {
                html += `
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-right">
                    <button type="submit" class="btn btn-warning btn-sm">
                        <i class="far fa-edit"></i>
                        Edit
                    </button>  
                </td>
            </tr>
                `
            });

            $(Selectors.productList).html(html);
        },

        getSelectors : function (){
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
                    <button type="submit" class="btn  btn-warning btn-sm">
                <i class="far fa-edit"></i>
                    </button>
            </td>
            </tr>              
            `;

            $(Selectors.productList).append(item);  /* eklene // html +=  */
        },
        clearInputs: function () {
            $(Selectors.productName).val('') ;
            $(Selectors.productPrice).val('');
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
    }

})();
