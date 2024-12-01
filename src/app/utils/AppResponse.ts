class AppResponse {
  public success: boolean;
  constructor(
    public status: number,
    public data: any,
    public message: string,
    public meta?: any
  ) {
    this.success = status < 400;
    this.status = status;
    this.message = message;

    if (meta) {
      this.meta = meta;
    }
    this.data = data;
  }
}

export default AppResponse;
