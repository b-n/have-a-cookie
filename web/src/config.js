const dev = {
  endpoint: 'https://mvpreedxy0.execute-api.eu-central-1.amazonaws.com/dev/'
}

const prod = {
  endpoint: 'https://mvpreedxy0.execute-api.eu-central-1.amazonaws.com/dev/'
}

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export { config }
