export const request = config => {
  config = Object.assign({}, {
    url: '',
    body: undefined,
    method: 'GET',
    headers: undefined,
    isJson: true,
    isBlob: false,
  }, config)

  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  let elements = {
    method: config.method,
    body: config.body,
    headers: config.headers ? config.headers : headers
  }

  return (
    fetch(config.url, elements)
      .then((response) => {
        // console.log('response: %o', response)
        if (!response.ok) {
          let error = new Error(response.statusText || 'Something bas happen')
          error.response = response
          throw error
        }

        if (config.isBlob) return response.blob()
        if (config.isJson) return response.json()

        return response.text()
      })
  )
}