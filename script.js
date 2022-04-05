class Student {
    bundleSize = 20;
    async intitTable() {
        sessionStorage.setItem("startIndex", 0);
        let data = await this.fetchNext();
        if (data.length > 0) {
            let table = document.querySelector(".table");
            let tr = document.createElement("tr");
            Object.entries(data[0])
                .slice()
                .reverse()
                .forEach(([key, value]) => {
                    let th = document.createElement("th");
                    th.innerText = key;
                    tr.appendChild(th);
                });
            table.appendChild(tr);
        }
        this.updateTable(data);
    }
    updateTable(data) {
        var table = document.querySelector("table");
        data.forEach(element => {
            let tr = document.createElement("tr");
            Object.entries(element)
                .slice()
                .reverse()
                .forEach(([key, value]) => {
                    let td = document.createElement("td");
                    td.innerText = value;
                    tr.appendChild(td);
                });
            table.appendChild(tr);
        });
        hideSnackBar();
    }
    async fetchNext() {
        console.log(sessionStorage.getItem("startIndex"));
        let data = await this.loadJSON();
        let slice = data.slice(
            parseInt(sessionStorage.getItem("startIndex")),
            parseInt(sessionStorage.getItem("startIndex")) + this.bundleSize,
        );
        sessionStorage.setItem("startIndex", parseInt(sessionStorage.getItem("startIndex")) + this.bundleSize);
        return slice;
    }
    loadJSON() {
        return new Promise(function (resolve, reject) {
            fetch("sample.json")
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }
}
function showSnackBar() {
    // Get the snackbar DIV
    let x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
}
function hideSnackBar() {
    let x = document.getElementById("snackbar");
    x.className = x.className.replace("show", "");
    sessionStorage.setItem("isProcessing", "false");
}
let student = new Student();
student.intitTable();
sessionStorage.setItem("isProcessing", "false");
window.addEventListener("scroll", () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 20 && sessionStorage.getItem("isProcessing") != "true") {
        console.log(sessionStorage.getItem("isProcessing"));
        showSnackBar();
        sessionStorage.setItem("isProcessing", "true");
        (async () => {
            setTimeout(async function () {
                student.updateTable(await student.fetchNext());
            }, 1000);
        })();
    }
});
document.querySelector("#menu-toggler").addEventListener("click", () => document.body.classList.toggle("menu-active"));
