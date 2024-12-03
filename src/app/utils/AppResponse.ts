import { IMeta } from "../types";

class AppResponse {
  public success: boolean;
  constructor(
    public status: number,
    public data: any,
    public message: string,
    public meta?: IMeta
  ) {
    this.success = status < 400;
    this.status = status;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}

export default AppResponse;
