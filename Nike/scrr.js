document.addEventListener("DOMContentLoaded", function () {
    var modals = document.querySelectorAll(".modal"); 
    var paymentModal = document.getElementById("paymentModal"); 
    var modalProductName = document.getElementById("modalProductName"); 
    var modalProductPrice = document.getElementById("modalProductPrice"); 
    var qrCode = document.getElementById("qrCode"); 
    var closeModal = document.querySelector(".close-btn"); 


    modals.forEach(function (modal) {
        var addCartButton = modal.querySelector(".addCart");
        var productNameElement = modal.querySelector(".nameProduct");
        var priceElement = modal.querySelector(".price");

        if (addCartButton && productNameElement && priceElement) {
            addCartButton.addEventListener('click', function(){
                var productName = productNameElement.textContent.trim();  
                var productPrice = priceElement.textContent.trim();
                modalProductName.textContent = productName;
                modalProductPrice.textContent = "Giá" + productPrice;

                var qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(productName + " - " + productPrice)}`;
                qrCode.src = qrCodeURL;

                paymentModal.style.display = "flex";
            })
        }
    })

    closeModal.addEventListener('click',function(){
        paymentModal.style.display = "none";
    })

    paymentModal.addEventListener('click', function(event){
        if(event.target === paymentModal) {
            paymentModal.style.display = "none";
        } 
    })
    console.log("halo");
});
