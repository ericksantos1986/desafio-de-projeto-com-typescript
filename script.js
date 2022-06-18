(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function calcMin(mil) {
        const min = Math.ceil(mil / 60000);
        return min;
    }
    function calcValor(tempo) {
        return parseInt($("#valor").value) * tempo;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.modelo}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                <button class="delete" data-placa="${veiculo.placa}">Encerrar</button>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { entrada, modelo } = ler().find(veiculo => veiculo.placa == placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            const valor = calcValor(calcMin(new Date().getTime() - new Date(entrada).getTime()));
            if (!confirm(`O veículo ${modelo} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            if (!valor) {
                alert(`Insira o valor para continuar.`);
                return;
            }
            else {
                alert(`O valor total a pagar é de ${valor} reais.`);
            }
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
            ;
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const modelo = (_a = $("#modelo")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!modelo || !placa) {
            alert("Os campos modelo e placa são obrigatórios");
            return;
        }
        patio().adicionar({ modelo, placa, entrada: new Date().toISOString() }, true);
    });
})();
