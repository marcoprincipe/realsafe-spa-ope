export const messages: any = {

    // Mensagens comuns

    "unknown.error": "Erro não previsto : {0}",
    "application.initialization.error": "Falha na inicialização da aplicação",
    "operation.canceled": "Operação cancelada",

    // Mensagens de verificação

    "services.communication.error": "Falha na comunicação com os serviços",
    "initializing.app": "Inicializando a aplicação",
    "initialization.ok": "Aplicação inicializada com sucesso",
    "initialization.failed": "Falha na inicialização da aplicação : {0}}",
    "checking.services": "Efetuando a verificação dos serviços",
    "check.services.success": "Verificação dos serviços realizada com sucesso",
    "check.services.failed": "Falha na verificação dos serviços : {0}",
    "open.printer": "Efetuando a abertura da impressora",
    "open.printer.success": "Abertura da impressora realizada com sucesso",
    "open.printer.failed": "Falha na abertua da impressora : {0}",
    "checking.printer": "Efetuando a verificação da impressora",
    "check.printer.success": "Verificação da impressora realizada com sucesso",
    "check.printer.failed": "Falha na verificação da impressora : {0}",
    "checking.depository": "Efetuando a verificação do depositário",
    "open.depository": "Efetuando a abertura do depositário",
    "open.depository.success": "Abertura do depositário realizada com sucesso",
    "open.depository.failed": "Falha na abertura do depositário : {0}",
    "check.depository.success": "Verificação do depositário realizada com sucesso",
    "check.depository.failed": "Falha na verificação do depositário : {0}",
    "open.sensors": "Efetuando a abertura da placa de sensores",
    "open.sensors.success": "Abertura da placa de sensores realizada com sucesso",
    "open.sensors.failed": "Falha na abertura da placa de sensores : {0}",
    "close.sensors.success": "Fechamnto da placa de sensores realizada com sucesso",
    "close.sensors.failed": "Falha no fechamento da placa de sensores",
    "check.sensors.success": "Verificação da placa de sensores realizada com sucesso",
    "check.sensors.failed": "Falha na verificação da placa de sensores : {0}",
    "checking.peripherals": "Efetuando a verificação dos periféricos",
    "check.peripherals.success": "Verificação dos periféricos realizada com sucesso",
    "check.peripherals.failed": "Falha na verificação dos periféricos : {0}",
    "getting.terminal.info": "Obtendo informações do terminal",
    "getting.terminal.parameters": "Obtendo os parâmetros de configuração do terminal",
    "getting.terminal.status.info": "Obtendo informações do status do terminal",
    "deposit.not.allowed": "Depósito não disponível",
    "pouch.not.present": "Malote não está presente",
    "safe.door.open": "Porta do cofre aberta",
    "vibration.detected": "Vibração detectada",

    // Mensagens de login

    "load.company.failed": "Falha na carga das empresas",
    "load.unit.failed": "Falha na carga das unidades",

    // Mensagens de troca de senha

    "change.password.success": "Troca da senha efetuada com sucesso",

    // Mensagens do depositário

    "initializing.depository": "Inicializando o depositário",
    "depository.initialization.success": "Depositário inicializado com sucesso",
    "depository.initialization.failed": "Falha na inicialização do depositário",
    "confirm.deposit": "Confirma o depósito de R$ {0} ?",
    "deposit.success": "Depósito no valor de R$ {0} realizado com sucesso",
    "deposit.failed": "Falha na realização do depósito : {0}",
    "end.deposit.failed": "Falha na finalização do depósito : {0}",
    "insert.banknotes": "Favor inserir as cédulas no depositário",
    "wait.count.banknotes": "Aguarde pela contagem das cédulas",
    "count.banknotes.failed": "Falha na contagem das cédulas {0}",
    "printing.receipt": "Imprimindo o comprovante, por favor aguarde...",
    "printing.receipt.failed": "Falha na impressão do comprovante : {0}",

    // Mensagens da abertura / fechamento de terminal

    "opening.success": "Abertura do terminal efetuada com sucesso",
    "invalid.accouunting.date": "Data contábil informada inválida",
    "closing.success": "Fechamento do terminal efetuado com sucesso",

    // Mensagens do log de transações

    "printing.bank.statement": "Imprimindo o extrato, por favor aguarde...",
    "printing.bank.statement.success": "Impressão do extrato realizada com sucesso",
    "log.deposit.transaction.failed": "Falha na gravação do log da transação de depósito",

    // Mensagens do recolhimento de numerário

    "cash.collection.success": "Recolhimento do numerário efetuado com sucesso",

    // Mensagens da reimpressão de comprovantes

    "no.vouchers.found": "Nenhum comprovante encontrado",
    "invalid.nsu.format": "NSU informado inválido",
    "invalid.start.date": "Data inicial informada inválida",
    "invalid.end.date": "Data final informada inválida",

    // Mensagens do cadastro de empresas

    "company.create.success": "Empresa cadastrada com sucesso",
    "company.create.error": "Falha na criação da empresa",
    "company.remove.success": "Empresa removida com sucesso",
    "company.remove.error": "Falha na remoção da empresa",

    // Formata a  mensagem informada

    format: (key: string, ...args: any[]) => {

        let result: string = messages[key];

        for (let index: number = 0; index < args.length; index++) {
            result = result.replace(`{${index}}`, args[index]);
        }

        return result;

    }

};