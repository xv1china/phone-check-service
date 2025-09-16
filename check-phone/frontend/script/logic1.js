const serviceSelect = document.getElementById("service");
const planFirstSelect = document.getElementById("planFirst");
const planSecondSelect = document.getElementById("planSecond");

serviceSelect.addEventListener("change", function () {
    if (this.value === "phoneCheck") {
        planFirstSelect.style.display = "none";
        planFirstSelect.required = false;   // აღარ არის აუცილებელი
        planFirstSelect.value = "";

        planSecondSelect.style.display = "block";
        planSecondSelect.required = true;   // ეს ხდება აუცილებელი
    }
    else if (this.value === "phoneBuy") {
        planSecondSelect.style.display = "none";
        planSecondSelect.required = false;
        planSecondSelect.value = "";

        planFirstSelect.style.display = "block";
        planFirstSelect.required = true;
    }
    else {
        planFirstSelect.style.display = "none";
        planFirstSelect.required = false;
        planFirstSelect.value = "";

        planSecondSelect.style.display = "none";
        planSecondSelect.required = false;
        planSecondSelect.value = "";
    }
});

document.querySelector("form").addEventListener("submit", function (e) {
    if (serviceSelect.value === "") {
        alert("გთხოვ აირჩიე სერვისი.");
        e.preventDefault();
        return;
    }

    if (planFirstSelect.style.display === "block" && planFirstSelect.value === "") {
        alert("გთხოვ აირჩიე პაკეტი.");
        e.preventDefault();
        return;
    }

    if (planSecondSelect.style.display === "block" && planSecondSelect.value === "") {
        alert("გთხოვ აირჩიე პაკეტი.");
        e.preventDefault();
        return;
    }
});
