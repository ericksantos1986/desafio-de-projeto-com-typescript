interface IVeiculo{
    modelo: string;
    placa: string;
    entrada: Date | string;
}

(function() {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000)
        const sec = Math.floor((mil % 60000)/1000);

        return `${min}m e ${sec}s`;
    }

    function calcMin(mil: number){
        const min: number = Math.ceil(mil / 60000)
        return min;
    }

    function calcValor(tempo: number){
        return parseInt($("#valor").value) * tempo;        
    }

    function patio(){
        function ler(): IVeiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        
        function salvar(veiculos: IVeiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function adicionar(veiculo: IVeiculo, salva?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.modelo}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                <button class="delete" data-placa="${veiculo.placa}">Encerrar</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);
            })

            $("#patio")?.appendChild(row);

            if(salva) salvar([... ler(), veiculo]);
        }

        function remover(placa: string){
            const { entrada, modelo } = ler().find(veiculo => veiculo.placa == placa);

            const tempo = calcTempo (new Date().getTime() - new Date(entrada).getTime());

            const valor = calcValor (calcMin(new Date().getTime() - new Date(entrada).getTime()))

            if(!confirm(`O veículo ${modelo} permaneceu por ${tempo}. Deseja encerrar?`))  
                
                return ;
            if(!valor){
                alert(`Insira o valor para encerrar.`)
                return;
            } else{
                alert(`O valor total a pagar é de ${valor} reais.`)
            }

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();
            
            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo));                    
            };                       
        }

        return{ ler, adicionar, remover, salvar, render}
    }
    
    patio().render();

    $("#cadastrar")?.addEventListener("click",() => {
        const modelo = $("#modelo")?.value;
        const placa = $("#placa")?.value;

        if(!modelo || !placa){
            alert("Os campos modelo e placa são obrigatórios")
            return;
        }

        patio().adicionar({modelo, placa, entrada: new Date().toISOString()}, true)
    })
 })()