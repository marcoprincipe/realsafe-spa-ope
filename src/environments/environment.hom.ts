//==============================================
// Configurações do ambiente de homologação.
//==============================================

export const environment = {

  production: false,

  appResources: {

    "company": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "searchCompanies": "/api/v1/company/searchCompanies",
            "findCompanyById": "/api/v1/company/findCompanyById",
            "create": "/api/v1/company/create",
            "update": "/api/v1/company/update",
            "remove": "/api/v1/company/remove"
        }
    },
    "unit": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "listUnitsByCompanyId": "/api/v1/unit/listUnitsByCompanyId"
        }
    },
    "user": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "login": "/api/v1/user/login",
            "changePassword": "/api/v1/user/changePassword",
            "listUserGroups": "/api/v1/user/listUserGroups",
            "listUserCompanies": "/api/v1/user/listUserCompanies",
            "listUserUnits": "/api/v1/user/listUserUnits",
        }
    },
    "groupOwner": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "listGroupOwner": "/api/v1/group-owner/listGroupOwner",
            "findGroupOwnerById": "/api/v1/group-owner/findGroupOwnerById",
            "searchGroupOwners" : "/api/v1/group-owner/searchGroupOwners",
        }
    },
    "localGroupOwner": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "getLocalGroupOwner": "/api/v1/group-owner/getLocalGroupOwner",
        }
    },
    "localTerminal": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "getLocalTerminal": "/api/v1/terminal/getLocalTerminal",
            "listTerminalParameters": "/api/v1/terminal/listTerminalParameters",
        }
    },
    "terminal": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "getTerminalStatus": "/api/v1/terminal/getTerminalStatus",
            "openTerminal": "/api/v1/terminal/openTerminal",
            "printOpenTerminalReceipt": "/api/v1/terminal/printOpenTerminalReceipt",
            "getOpeningDetail": "/api/v1/terminal/getOpeningDetail",
            "closeTerminal": "/api/v1/terminal/closeTerminal",
            "printCloseTerminalReceipt": "/api/v1/terminal/printCloseTerminalReceipt",
            "getClosingDetail": "/api/v1/terminal/getClosingDetail",
        }
    },
    "functionality": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "listFunctionalitiesByRoleId": "/api/v1/functionality/listFunctionalitiesByRoleId"
        }
    },
    "transactionLog": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "listTransactionsByTerminal": "/api/v1/transaction-log/listTransactionsByTerminal",
            "listTransactionsByGroupOwner": "/api/v1/transaction-log/listTransactionsByGroupOwner",
            "searchTransactionLog": "/api/v1/transaction-log/searchTransactionLog",
            "listPedentDeposits": "/api/v1/transaction-log/listPedentDeposits",
            "listDepositDetails": "/api/v1/transaction-log/listDepositDetails",
            "printBankStatement": "/api/v1/transaction-log/printBankStatement",
        }
    },
    "deposit": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "deposit": "/api/v1/deposit/deposit",
            "printDepositReceipt": "/api/v1/deposit/printDepositReceipt",
        }
    },
    "cashCollection": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "collectCash": "/api/v1/cash-collection/collectCash",
            "printCollectCashReceipt": "/api/v1/cash-collection/printCollectCashReceipt",
            "listCashCollection": "/api/v1/cash-collection/listCashCollection",
            "listCashCollectionDetails": "/api/v1/cash-collection/listCashCollectionDetails",
        }
    },
    "depository": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "open": "/api/v1/depository/open",
            "close": "/api/v1/depository/close",
            "check": "/api/v1/depository/check",
            "getStatus": "/api/v1/depository/getStatus",
            "startDeposit": "/api/v1/depository/startDeposit",
            "deposit": "/api/v1/depository/deposit",
            "endDeposit": "/api/v1/depository/endDeposit",
            "reset": "/api/v1/depository/reset"
        }
    },
    "printer": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "open": "/api/v1/printer/open",
            "close": "/api/v1/printer/close",
            "check": "/api/v1/printer/check",
            "getStatus": "/api/v1/printer/getStatus",
            "print": "/api/v1/printer/print",
            "reset": "/api/v1/printer/reset"
        }
    },
    "sensors": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "open": "/api/v1/sensors/open",
            "close": "/api/v1/sensors/close",
            "getSensorsStatus": "/api/v1/sensors/getSensorsStatus"
        }
    },
    "health": {
        "endpoint": "http://localhost:8080/realsafe-ope",
        "resources": {
            "check": "/api/v1/health/check"
        }
    }

  }

};
