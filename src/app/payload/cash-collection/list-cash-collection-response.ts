import { BankNoteDeposit } from 'src/app/model';

/**
 * Interface para armazenamento dos dados de retorno da pesquisa
 * de recolhimento de numerario.
 */

export interface ListCashCollectionResponse {
    bankNotes: Array<BankNoteDeposit>;
}
