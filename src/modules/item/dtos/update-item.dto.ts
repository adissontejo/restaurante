import { CreateItemDTO } from "./create-item.dto"

export interface UpdateItemDTO extends Partial<CreateItemDTO> {}
