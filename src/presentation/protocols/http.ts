export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  // why optional? because we can have a get request without body
  body?: any
}
