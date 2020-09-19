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
        showTotal:function(total){
            var dolarKur = 7.4;
            var euroKur = 0.84;
            $(Selectors.totalDolar).text(total);
            $(Selectors.totalTl).text(parseFloat(dolarKur*total));
            $(Selectors.totalEuro).text(parseFloat(total*euroKur));
        }
    }

})();
