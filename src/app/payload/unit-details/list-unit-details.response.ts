import { UnitDetail } from 'src/app/model'

/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de uma filial/unidade.
 */

export interface ListUnitDetailsResponse {
    unitDetails: UnitDetail[];
}