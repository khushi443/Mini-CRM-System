function openDealForm() {

  const tableView =
    document.getElementById(
      "dealTableView"
    );

  const formPage =
    document.getElementById(
      "dealFormPage"
    );

  // HIDE TABLE
  tableView.style.display = "none";

  // SHOW FORM
  formPage.style.display = "block";

  // SMOOTH TOP SCROLL
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // ANIMATION
  formPage.style.opacity = "0";

  setTimeout(() => {

    formPage.style.opacity = "1";

  }, 100);

}

// =============================

function closeDealForm() {

  const tableView =
    document.getElementById(
      "dealTableView"
    );

  const formPage =
    document.getElementById(
      "dealFormPage"
    );

  // HIDE FORM
  formPage.style.display = "none";

  // SHOW TABLE
  tableView.style.display = "block";

  // SCROLL TOP
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

// =============================
// OPTIONAL AUTO CLOSE
// =============================

document.addEventListener(
  "keydown",
  function(e){

    if(e.key === "Escape"){

      const formPage =
        document.getElementById(
          "dealFormPage"
        );

      if(
        formPage.style.display ===
        "block"
      ){

        closeDealForm();

      }

    }

  }
);
