/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 */

'use strict';

const msRest = require('ms-rest');
const msRestAzure = require('ms-rest-azure');
const WebResource = msRest.WebResource;
const moment = require('moment');

/**
 * Lists the Live Outputs in the Live Event.
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} liveEventName The name of the Live Event.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {object} [options.customHeaders] Headers that will be added to the
 * request
 *
 * @param {function} callback - The callback.
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {object} [result]   - The deserialized result object if an error did not occur.
 *                      See {@link LiveOutputListResult} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _list(resourceGroupName, accountName, liveEventName, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('callback cannot be null.');
  }
  // Validate
  try {
    if (this.client.subscriptionId === null || this.client.subscriptionId === undefined || typeof this.client.subscriptionId.valueOf() !== 'string') {
      throw new Error('this.client.subscriptionId cannot be null or undefined and it must be of type string.');
    }
    if (resourceGroupName === null || resourceGroupName === undefined || typeof resourceGroupName.valueOf() !== 'string') {
      throw new Error('resourceGroupName cannot be null or undefined and it must be of type string.');
    }
    if (accountName === null || accountName === undefined || typeof accountName.valueOf() !== 'string') {
      throw new Error('accountName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName === null || liveEventName === undefined || typeof liveEventName.valueOf() !== 'string') {
      throw new Error('liveEventName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName !== null && liveEventName !== undefined) {
      if (liveEventName.length > 32)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MaxLength": 32');
      }
      if (liveEventName.length < 1)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MinLength": 1');
      }
      if (liveEventName.match(/^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/) === null)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "Pattern": /^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/');
      }
    }
    if (this.client.apiVersion === null || this.client.apiVersion === undefined || typeof this.client.apiVersion.valueOf() !== 'string') {
      throw new Error('this.client.apiVersion cannot be null or undefined and it must be of type string.');
    }
    if (this.client.acceptLanguage !== null && this.client.acceptLanguage !== undefined && typeof this.client.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.client.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let baseUrl = this.client.baseUri;
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaservices/{accountName}/liveEvents/{liveEventName}/liveOutputs';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  requestUrl = requestUrl.replace('{liveEventName}', encodeURIComponent(liveEventName));
  let queryParameters = [];
  queryParameters.push('api-version=' + encodeURIComponent(this.client.apiVersion));
  if (queryParameters.length > 0) {
    requestUrl += '?' + queryParameters.join('&');
  }

  // Create HTTP transport objects
  let httpRequest = new WebResource();
  httpRequest.method = 'GET';
  httpRequest.url = requestUrl;
  httpRequest.headers = {};
  // Set Headers
  httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
  if (this.client.generateClientRequestId) {
      httpRequest.headers['x-ms-client-request-id'] = msRestAzure.generateUuid();
  }
  if (this.client.acceptLanguage !== undefined && this.client.acceptLanguage !== null) {
    httpRequest.headers['accept-language'] = this.client.acceptLanguage;
  }
  if(options) {
    for(let headerName in options['customHeaders']) {
      if (options['customHeaders'].hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = options['customHeaders'][headerName];
      }
    }
  }
  httpRequest.body = null;
  // Send Request
  return client.pipeline(httpRequest, (err, response, responseBody) => {
    if (err) {
      return callback(err);
    }
    let statusCode = response.statusCode;
    if (statusCode !== 200) {
      let error = new Error(responseBody);
      error.statusCode = response.statusCode;
      error.request = msRest.stripRequest(httpRequest);
      error.response = msRest.stripResponse(response);
      if (responseBody === '') responseBody = null;
      let parsedErrorResponse;
      try {
        parsedErrorResponse = JSON.parse(responseBody);
        if (parsedErrorResponse) {
          let internalError = null;
          if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
          error.code = internalError ? internalError.code : parsedErrorResponse.code;
          error.message = internalError ? internalError.message : parsedErrorResponse.message;
        }
        if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
          let resultMapper = new client.models['ApiError']().mapper();
          error.body = client.deserialize(resultMapper, parsedErrorResponse, 'error.body');
        }
      } catch (defaultError) {
        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                         `- "${responseBody}" for the default response.`;
        return callback(error);
      }
      return callback(error);
    }
    // Create Result
    let result = null;
    if (responseBody === '') responseBody = null;
    // Deserialize Response
    if (statusCode === 200) {
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined) {
          let resultMapper = new client.models['LiveOutputListResult']().mapper();
          result = client.deserialize(resultMapper, parsedResponse, 'result');
        }
      } catch (error) {
        let deserializationError = new Error(`Error ${error} occurred in deserializing the responseBody - ${responseBody}`);
        deserializationError.request = msRest.stripRequest(httpRequest);
        deserializationError.response = msRest.stripResponse(response);
        return callback(deserializationError);
      }
    }

    return callback(null, result, httpRequest, response);
  });
}

/**
 * Gets a Live Output.
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} liveEventName The name of the Live Event.
 *
 * @param {string} liveOutputName The name of the Live Output.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {object} [options.customHeaders] Headers that will be added to the
 * request
 *
 * @param {function} callback - The callback.
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {object} [result]   - The deserialized result object if an error did not occur.
 *                      See {@link LiveOutput} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _get(resourceGroupName, accountName, liveEventName, liveOutputName, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('callback cannot be null.');
  }
  // Validate
  try {
    if (this.client.subscriptionId === null || this.client.subscriptionId === undefined || typeof this.client.subscriptionId.valueOf() !== 'string') {
      throw new Error('this.client.subscriptionId cannot be null or undefined and it must be of type string.');
    }
    if (resourceGroupName === null || resourceGroupName === undefined || typeof resourceGroupName.valueOf() !== 'string') {
      throw new Error('resourceGroupName cannot be null or undefined and it must be of type string.');
    }
    if (accountName === null || accountName === undefined || typeof accountName.valueOf() !== 'string') {
      throw new Error('accountName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName === null || liveEventName === undefined || typeof liveEventName.valueOf() !== 'string') {
      throw new Error('liveEventName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName !== null && liveEventName !== undefined) {
      if (liveEventName.length > 32)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MaxLength": 32');
      }
      if (liveEventName.length < 1)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MinLength": 1');
      }
      if (liveEventName.match(/^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/) === null)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "Pattern": /^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/');
      }
    }
    if (liveOutputName === null || liveOutputName === undefined || typeof liveOutputName.valueOf() !== 'string') {
      throw new Error('liveOutputName cannot be null or undefined and it must be of type string.');
    }
    if (liveOutputName !== null && liveOutputName !== undefined) {
      if (liveOutputName.length > 256)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "MaxLength": 256');
      }
      if (liveOutputName.length < 1)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "MinLength": 1');
      }
      if (liveOutputName.match(/^([a-zA-Z0-9])+(-*[a-zA-Z0-9])*$/) === null)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "Pattern": /^([a-zA-Z0-9])+(-*[a-zA-Z0-9])*$/');
      }
    }
    if (this.client.apiVersion === null || this.client.apiVersion === undefined || typeof this.client.apiVersion.valueOf() !== 'string') {
      throw new Error('this.client.apiVersion cannot be null or undefined and it must be of type string.');
    }
    if (this.client.acceptLanguage !== null && this.client.acceptLanguage !== undefined && typeof this.client.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.client.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let baseUrl = this.client.baseUri;
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaservices/{accountName}/liveEvents/{liveEventName}/liveOutputs/{liveOutputName}';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  requestUrl = requestUrl.replace('{liveEventName}', encodeURIComponent(liveEventName));
  requestUrl = requestUrl.replace('{liveOutputName}', encodeURIComponent(liveOutputName));
  let queryParameters = [];
  queryParameters.push('api-version=' + encodeURIComponent(this.client.apiVersion));
  if (queryParameters.length > 0) {
    requestUrl += '?' + queryParameters.join('&');
  }

  // Create HTTP transport objects
  let httpRequest = new WebResource();
  httpRequest.method = 'GET';
  httpRequest.url = requestUrl;
  httpRequest.headers = {};
  // Set Headers
  httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
  if (this.client.generateClientRequestId) {
      httpRequest.headers['x-ms-client-request-id'] = msRestAzure.generateUuid();
  }
  if (this.client.acceptLanguage !== undefined && this.client.acceptLanguage !== null) {
    httpRequest.headers['accept-language'] = this.client.acceptLanguage;
  }
  if(options) {
    for(let headerName in options['customHeaders']) {
      if (options['customHeaders'].hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = options['customHeaders'][headerName];
      }
    }
  }
  httpRequest.body = null;
  // Send Request
  return client.pipeline(httpRequest, (err, response, responseBody) => {
    if (err) {
      return callback(err);
    }
    let statusCode = response.statusCode;
    if (statusCode !== 200 && statusCode !== 404) {
      let error = new Error(responseBody);
      error.statusCode = response.statusCode;
      error.request = msRest.stripRequest(httpRequest);
      error.response = msRest.stripResponse(response);
      if (responseBody === '') responseBody = null;
      let parsedErrorResponse;
      try {
        parsedErrorResponse = JSON.parse(responseBody);
        if (parsedErrorResponse) {
          let internalError = null;
          if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
          error.code = internalError ? internalError.code : parsedErrorResponse.code;
          error.message = internalError ? internalError.message : parsedErrorResponse.message;
        }
        if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
          let resultMapper = new client.models['ApiError']().mapper();
          error.body = client.deserialize(resultMapper, parsedErrorResponse, 'error.body');
        }
      } catch (defaultError) {
        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                         `- "${responseBody}" for the default response.`;
        return callback(error);
      }
      return callback(error);
    }
    // Create Result
    let result = null;
    if (responseBody === '') responseBody = null;
    // Deserialize Response
    if (statusCode === 200) {
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined) {
          let resultMapper = new client.models['LiveOutput']().mapper();
          result = client.deserialize(resultMapper, parsedResponse, 'result');
        }
      } catch (error) {
        let deserializationError = new Error(`Error ${error} occurred in deserializing the responseBody - ${responseBody}`);
        deserializationError.request = msRest.stripRequest(httpRequest);
        deserializationError.response = msRest.stripResponse(response);
        return callback(deserializationError);
      }
    }

    return callback(null, result, httpRequest, response);
  });
}


/**
 * Creates a Live Output.
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} liveEventName The name of the Live Event.
 *
 * @param {string} liveOutputName The name of the Live Output.
 *
 * @param {object} parameters Live Output properties needed for creation.
 *
 * @param {string} [parameters.description] The description of the Live Output.
 *
 * @param {string} [parameters.assetName] The asset name.
 *
 * @param {moment.duration} [parameters.archiveWindowLength] ISO 8601 timespan
 * duration of the archive window length. This is duration that customer want
 * to retain the recorded content.
 *
 * @param {string} [parameters.manifestName] The manifest file name.
 *
 * @param {object} [parameters.hls] The HLS configuration.
 *
 * @param {number} [parameters.hls.fragmentsPerTsSegment] The amount of
 * fragments per HTTP Live Streaming (HLS) segment.
 *
 * @param {number} [parameters.outputSnapTime] The output snapshot time.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {object} [options.customHeaders] Headers that will be added to the
 * request
 *
 * @param {function} callback - The callback.
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {object} [result]   - The deserialized result object if an error did not occur.
 *                      See {@link LiveOutput} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _create(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }

  if (!callback) {
    throw new Error('callback cannot be null.');
  }

  // Send request
  this.beginCreate(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, (err, parsedResult, httpRequest, response) => {
    if (err) return callback(err);

    let initialResult = new msRest.HttpOperationResponse();
    initialResult.request = httpRequest;
    initialResult.response = response;
    initialResult.body = response.body;
    client.getLongRunningOperationResult(initialResult, options, (err, pollingResult) => {
      if (err) return callback(err);

      // Create Result
      let result = null;

      httpRequest = pollingResult.request;
      response = pollingResult.response;
      let responseBody = pollingResult.body;
      if (responseBody === '') responseBody = null;

      // Deserialize Response
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined) {
          let resultMapper = new client.models['LiveOutput']().mapper();
          result = client.deserialize(resultMapper, parsedResponse, 'result');
        }
      } catch (error) {
        let deserializationError = new Error(`Error ${error} occurred in deserializing the responseBody - ${responseBody}`);
        deserializationError.request = msRest.stripRequest(httpRequest);
        deserializationError.response = msRest.stripResponse(response);
        return callback(deserializationError);
      }

      return callback(null, result, httpRequest, response);
    });
  });
}


/**
 * Deletes a Live Output.
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} liveEventName The name of the Live Event.
 *
 * @param {string} liveOutputName The name of the Live Output.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {object} [options.customHeaders] Headers that will be added to the
 * request
 *
 * @param {function} callback - The callback.
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {null} [result]   - The deserialized result object if an error did not occur.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _deleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }

  if (!callback) {
    throw new Error('callback cannot be null.');
  }

  // Send request
  this.beginDeleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, (err, parsedResult, httpRequest, response) => {
    if (err) return callback(err);

    let initialResult = new msRest.HttpOperationResponse();
    initialResult.request = httpRequest;
    initialResult.response = response;
    initialResult.body = response.body;
    client.getLongRunningOperationResult(initialResult, options, (err, pollingResult) => {
      if (err) return callback(err);

      // Create Result
      let result = null;

      httpRequest = pollingResult.request;
      response = pollingResult.response;
      let responseBody = pollingResult.body;
      if (responseBody === '') responseBody = null;

      // Deserialize Response

      return callback(null, result, httpRequest, response);
    });
  });
}

/**
 * Creates a Live Output.
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} liveEventName The name of the Live Event.
 *
 * @param {string} liveOutputName The name of the Live Output.
 *
 * @param {object} parameters Live Output properties needed for creation.
 *
 * @param {string} [parameters.description] The description of the Live Output.
 *
 * @param {string} [parameters.assetName] The asset name.
 *
 * @param {moment.duration} [parameters.archiveWindowLength] ISO 8601 timespan
 * duration of the archive window length. This is duration that customer want
 * to retain the recorded content.
 *
 * @param {string} [parameters.manifestName] The manifest file name.
 *
 * @param {object} [parameters.hls] The HLS configuration.
 *
 * @param {number} [parameters.hls.fragmentsPerTsSegment] The amount of
 * fragments per HTTP Live Streaming (HLS) segment.
 *
 * @param {number} [parameters.outputSnapTime] The output snapshot time.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {object} [options.customHeaders] Headers that will be added to the
 * request
 *
 * @param {function} callback - The callback.
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {object} [result]   - The deserialized result object if an error did not occur.
 *                      See {@link LiveOutput} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _beginCreate(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('callback cannot be null.');
  }
  // Validate
  try {
    if (this.client.subscriptionId === null || this.client.subscriptionId === undefined || typeof this.client.subscriptionId.valueOf() !== 'string') {
      throw new Error('this.client.subscriptionId cannot be null or undefined and it must be of type string.');
    }
    if (resourceGroupName === null || resourceGroupName === undefined || typeof resourceGroupName.valueOf() !== 'string') {
      throw new Error('resourceGroupName cannot be null or undefined and it must be of type string.');
    }
    if (accountName === null || accountName === undefined || typeof accountName.valueOf() !== 'string') {
      throw new Error('accountName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName === null || liveEventName === undefined || typeof liveEventName.valueOf() !== 'string') {
      throw new Error('liveEventName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName !== null && liveEventName !== undefined) {
      if (liveEventName.length > 32)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MaxLength": 32');
      }
      if (liveEventName.length < 1)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MinLength": 1');
      }
      if (liveEventName.match(/^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/) === null)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "Pattern": /^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/');
      }
    }
    if (liveOutputName === null || liveOutputName === undefined || typeof liveOutputName.valueOf() !== 'string') {
      throw new Error('liveOutputName cannot be null or undefined and it must be of type string.');
    }
    if (liveOutputName !== null && liveOutputName !== undefined) {
      if (liveOutputName.length > 256)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "MaxLength": 256');
      }
      if (liveOutputName.length < 1)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "MinLength": 1');
      }
      if (liveOutputName.match(/^([a-zA-Z0-9])+(-*[a-zA-Z0-9])*$/) === null)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "Pattern": /^([a-zA-Z0-9])+(-*[a-zA-Z0-9])*$/');
      }
    }
    if (this.client.apiVersion === null || this.client.apiVersion === undefined || typeof this.client.apiVersion.valueOf() !== 'string') {
      throw new Error('this.client.apiVersion cannot be null or undefined and it must be of type string.');
    }
    if (parameters === null || parameters === undefined) {
      throw new Error('parameters cannot be null or undefined.');
    }
    if (this.client.acceptLanguage !== null && this.client.acceptLanguage !== undefined && typeof this.client.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.client.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let baseUrl = this.client.baseUri;
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaservices/{accountName}/liveEvents/{liveEventName}/liveOutputs/{liveOutputName}';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  requestUrl = requestUrl.replace('{liveEventName}', encodeURIComponent(liveEventName));
  requestUrl = requestUrl.replace('{liveOutputName}', encodeURIComponent(liveOutputName));
  let queryParameters = [];
  queryParameters.push('api-version=' + encodeURIComponent(this.client.apiVersion));
  if (queryParameters.length > 0) {
    requestUrl += '?' + queryParameters.join('&');
  }

  // Create HTTP transport objects
  let httpRequest = new WebResource();
  httpRequest.method = 'PUT';
  httpRequest.url = requestUrl;
  httpRequest.headers = {};
  // Set Headers
  httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
  if (this.client.generateClientRequestId) {
      httpRequest.headers['x-ms-client-request-id'] = msRestAzure.generateUuid();
  }
  if (this.client.acceptLanguage !== undefined && this.client.acceptLanguage !== null) {
    httpRequest.headers['accept-language'] = this.client.acceptLanguage;
  }
  if(options) {
    for(let headerName in options['customHeaders']) {
      if (options['customHeaders'].hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = options['customHeaders'][headerName];
      }
    }
  }
  // Serialize Request
  let requestContent = null;
  let requestModel = null;
  try {
    if (parameters !== null && parameters !== undefined) {
      let requestModelMapper = new client.models['LiveOutput']().mapper();
      requestModel = client.serialize(requestModelMapper, parameters, 'parameters');
      requestContent = JSON.stringify(requestModel);
    }
  } catch (error) {
    let serializationError = new Error(`Error "${error.message}" occurred in serializing the ` +
        `payload - ${JSON.stringify(parameters, null, 2)}.`);
    return callback(serializationError);
  }
  httpRequest.body = requestContent;
  // Send Request
  return client.pipeline(httpRequest, (err, response, responseBody) => {
    if (err) {
      return callback(err);
    }
    let statusCode = response.statusCode;
    if (statusCode !== 200 && statusCode !== 202) {
      let error = new Error(responseBody);
      error.statusCode = response.statusCode;
      error.request = msRest.stripRequest(httpRequest);
      error.response = msRest.stripResponse(response);
      if (responseBody === '') responseBody = null;
      let parsedErrorResponse;
      try {
        parsedErrorResponse = JSON.parse(responseBody);
        if (parsedErrorResponse) {
          let internalError = null;
          if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
          error.code = internalError ? internalError.code : parsedErrorResponse.code;
          error.message = internalError ? internalError.message : parsedErrorResponse.message;
        }
        if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
          let resultMapper = new client.models['ApiError']().mapper();
          error.body = client.deserialize(resultMapper, parsedErrorResponse, 'error.body');
        }
      } catch (defaultError) {
        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                         `- "${responseBody}" for the default response.`;
        return callback(error);
      }
      return callback(error);
    }
    // Create Result
    let result = null;
    if (responseBody === '') responseBody = null;
    // Deserialize Response
    if (statusCode === 200) {
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined) {
          let resultMapper = new client.models['LiveOutput']().mapper();
          result = client.deserialize(resultMapper, parsedResponse, 'result');
        }
      } catch (error) {
        let deserializationError = new Error(`Error ${error} occurred in deserializing the responseBody - ${responseBody}`);
        deserializationError.request = msRest.stripRequest(httpRequest);
        deserializationError.response = msRest.stripResponse(response);
        return callback(deserializationError);
      }
    }
    // Deserialize Response
    if (statusCode === 202) {
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined) {
          let resultMapper = new client.models['LiveOutput']().mapper();
          result = client.deserialize(resultMapper, parsedResponse, 'result');
        }
      } catch (error) {
        let deserializationError1 = new Error(`Error ${error} occurred in deserializing the responseBody - ${responseBody}`);
        deserializationError1.request = msRest.stripRequest(httpRequest);
        deserializationError1.response = msRest.stripResponse(response);
        return callback(deserializationError1);
      }
    }

    return callback(null, result, httpRequest, response);
  });
}

/**
 * Deletes a Live Output.
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} liveEventName The name of the Live Event.
 *
 * @param {string} liveOutputName The name of the Live Output.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {object} [options.customHeaders] Headers that will be added to the
 * request
 *
 * @param {function} callback - The callback.
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {null} [result]   - The deserialized result object if an error did not occur.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _beginDeleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('callback cannot be null.');
  }
  // Validate
  try {
    if (this.client.subscriptionId === null || this.client.subscriptionId === undefined || typeof this.client.subscriptionId.valueOf() !== 'string') {
      throw new Error('this.client.subscriptionId cannot be null or undefined and it must be of type string.');
    }
    if (resourceGroupName === null || resourceGroupName === undefined || typeof resourceGroupName.valueOf() !== 'string') {
      throw new Error('resourceGroupName cannot be null or undefined and it must be of type string.');
    }
    if (accountName === null || accountName === undefined || typeof accountName.valueOf() !== 'string') {
      throw new Error('accountName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName === null || liveEventName === undefined || typeof liveEventName.valueOf() !== 'string') {
      throw new Error('liveEventName cannot be null or undefined and it must be of type string.');
    }
    if (liveEventName !== null && liveEventName !== undefined) {
      if (liveEventName.length > 32)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MaxLength": 32');
      }
      if (liveEventName.length < 1)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "MinLength": 1');
      }
      if (liveEventName.match(/^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/) === null)
      {
        throw new Error('"liveEventName" should satisfy the constraint - "Pattern": /^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$/');
      }
    }
    if (liveOutputName === null || liveOutputName === undefined || typeof liveOutputName.valueOf() !== 'string') {
      throw new Error('liveOutputName cannot be null or undefined and it must be of type string.');
    }
    if (liveOutputName !== null && liveOutputName !== undefined) {
      if (liveOutputName.length > 256)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "MaxLength": 256');
      }
      if (liveOutputName.length < 1)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "MinLength": 1');
      }
      if (liveOutputName.match(/^([a-zA-Z0-9])+(-*[a-zA-Z0-9])*$/) === null)
      {
        throw new Error('"liveOutputName" should satisfy the constraint - "Pattern": /^([a-zA-Z0-9])+(-*[a-zA-Z0-9])*$/');
      }
    }
    if (this.client.apiVersion === null || this.client.apiVersion === undefined || typeof this.client.apiVersion.valueOf() !== 'string') {
      throw new Error('this.client.apiVersion cannot be null or undefined and it must be of type string.');
    }
    if (this.client.acceptLanguage !== null && this.client.acceptLanguage !== undefined && typeof this.client.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.client.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let baseUrl = this.client.baseUri;
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaservices/{accountName}/liveEvents/{liveEventName}/liveOutputs/{liveOutputName}';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  requestUrl = requestUrl.replace('{liveEventName}', encodeURIComponent(liveEventName));
  requestUrl = requestUrl.replace('{liveOutputName}', encodeURIComponent(liveOutputName));
  let queryParameters = [];
  queryParameters.push('api-version=' + encodeURIComponent(this.client.apiVersion));
  if (queryParameters.length > 0) {
    requestUrl += '?' + queryParameters.join('&');
  }

  // Create HTTP transport objects
  let httpRequest = new WebResource();
  httpRequest.method = 'DELETE';
  httpRequest.url = requestUrl;
  httpRequest.headers = {};
  // Set Headers
  httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
  if (this.client.generateClientRequestId) {
      httpRequest.headers['x-ms-client-request-id'] = msRestAzure.generateUuid();
  }
  if (this.client.acceptLanguage !== undefined && this.client.acceptLanguage !== null) {
    httpRequest.headers['accept-language'] = this.client.acceptLanguage;
  }
  if(options) {
    for(let headerName in options['customHeaders']) {
      if (options['customHeaders'].hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = options['customHeaders'][headerName];
      }
    }
  }
  httpRequest.body = null;
  // Send Request
  return client.pipeline(httpRequest, (err, response, responseBody) => {
    if (err) {
      return callback(err);
    }
    let statusCode = response.statusCode;
    if (statusCode !== 200 && statusCode !== 202 && statusCode !== 204) {
      let error = new Error(responseBody);
      error.statusCode = response.statusCode;
      error.request = msRest.stripRequest(httpRequest);
      error.response = msRest.stripResponse(response);
      if (responseBody === '') responseBody = null;
      let parsedErrorResponse;
      try {
        parsedErrorResponse = JSON.parse(responseBody);
        if (parsedErrorResponse) {
          let internalError = null;
          if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
          error.code = internalError ? internalError.code : parsedErrorResponse.code;
          error.message = internalError ? internalError.message : parsedErrorResponse.message;
        }
        if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
          let resultMapper = new client.models['ApiError']().mapper();
          error.body = client.deserialize(resultMapper, parsedErrorResponse, 'error.body');
        }
      } catch (defaultError) {
        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                         `- "${responseBody}" for the default response.`;
        return callback(error);
      }
      return callback(error);
    }
    // Create Result
    let result = null;
    if (responseBody === '') responseBody = null;

    return callback(null, result, httpRequest, response);
  });
}

/**
 * Lists the Live Outputs in the Live Event.
 *
 * @param {string} nextPageLink The NextLink from the previous successful call
 * to List operation.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {object} [options.customHeaders] Headers that will be added to the
 * request
 *
 * @param {function} callback - The callback.
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {object} [result]   - The deserialized result object if an error did not occur.
 *                      See {@link LiveOutputListResult} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _listNext(nextPageLink, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('callback cannot be null.');
  }
  // Validate
  try {
    if (nextPageLink === null || nextPageLink === undefined || typeof nextPageLink.valueOf() !== 'string') {
      throw new Error('nextPageLink cannot be null or undefined and it must be of type string.');
    }
    if (this.client.acceptLanguage !== null && this.client.acceptLanguage !== undefined && typeof this.client.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.client.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let requestUrl = '{nextLink}';
  requestUrl = requestUrl.replace('{nextLink}', nextPageLink);

  // Create HTTP transport objects
  let httpRequest = new WebResource();
  httpRequest.method = 'GET';
  httpRequest.url = requestUrl;
  httpRequest.headers = {};
  // Set Headers
  httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
  if (this.client.generateClientRequestId) {
      httpRequest.headers['x-ms-client-request-id'] = msRestAzure.generateUuid();
  }
  if (this.client.acceptLanguage !== undefined && this.client.acceptLanguage !== null) {
    httpRequest.headers['accept-language'] = this.client.acceptLanguage;
  }
  if(options) {
    for(let headerName in options['customHeaders']) {
      if (options['customHeaders'].hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = options['customHeaders'][headerName];
      }
    }
  }
  httpRequest.body = null;
  // Send Request
  return client.pipeline(httpRequest, (err, response, responseBody) => {
    if (err) {
      return callback(err);
    }
    let statusCode = response.statusCode;
    if (statusCode !== 200) {
      let error = new Error(responseBody);
      error.statusCode = response.statusCode;
      error.request = msRest.stripRequest(httpRequest);
      error.response = msRest.stripResponse(response);
      if (responseBody === '') responseBody = null;
      let parsedErrorResponse;
      try {
        parsedErrorResponse = JSON.parse(responseBody);
        if (parsedErrorResponse) {
          let internalError = null;
          if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
          error.code = internalError ? internalError.code : parsedErrorResponse.code;
          error.message = internalError ? internalError.message : parsedErrorResponse.message;
        }
        if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
          let resultMapper = new client.models['ApiError']().mapper();
          error.body = client.deserialize(resultMapper, parsedErrorResponse, 'error.body');
        }
      } catch (defaultError) {
        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
                         `- "${responseBody}" for the default response.`;
        return callback(error);
      }
      return callback(error);
    }
    // Create Result
    let result = null;
    if (responseBody === '') responseBody = null;
    // Deserialize Response
    if (statusCode === 200) {
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined) {
          let resultMapper = new client.models['LiveOutputListResult']().mapper();
          result = client.deserialize(resultMapper, parsedResponse, 'result');
        }
      } catch (error) {
        let deserializationError = new Error(`Error ${error} occurred in deserializing the responseBody - ${responseBody}`);
        deserializationError.request = msRest.stripRequest(httpRequest);
        deserializationError.response = msRest.stripResponse(response);
        return callback(deserializationError);
      }
    }

    return callback(null, result, httpRequest, response);
  });
}

/** Class representing a LiveOutputs. */
class LiveOutputs {
  /**
   * Create a LiveOutputs.
   * @param {AzureMediaServices} client Reference to the service client.
   */
  constructor(client) {
    this.client = client;
    this._list = _list;
    this._get = _get;
    this._create = _create;
    this._deleteMethod = _deleteMethod;
    this._beginCreate = _beginCreate;
    this._beginDeleteMethod = _beginDeleteMethod;
    this._listNext = _listNext;
  }

  /**
   * Lists the Live Outputs in the Live Event.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<LiveOutputListResult>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  listWithHttpOperationResponse(resourceGroupName, accountName, liveEventName, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._list(resourceGroupName, accountName, liveEventName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * Lists the Live Outputs in the Live Event.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {LiveOutputListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link LiveOutputListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  list(resourceGroupName, accountName, liveEventName, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._list(resourceGroupName, accountName, liveEventName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._list(resourceGroupName, accountName, liveEventName, options, optionalCallback);
    }
  }

  /**
   * Gets a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<LiveOutput>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  getWithHttpOperationResponse(resourceGroupName, accountName, liveEventName, liveOutputName, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._get(resourceGroupName, accountName, liveEventName, liveOutputName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * Gets a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {LiveOutput} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link LiveOutput} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  get(resourceGroupName, accountName, liveEventName, liveOutputName, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._get(resourceGroupName, accountName, liveEventName, liveOutputName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._get(resourceGroupName, accountName, liveEventName, liveOutputName, options, optionalCallback);
    }
  }

  /**
   * Creates a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} parameters Live Output properties needed for creation.
   *
   * @param {string} [parameters.description] The description of the Live Output.
   *
   * @param {string} [parameters.assetName] The asset name.
   *
   * @param {moment.duration} [parameters.archiveWindowLength] ISO 8601 timespan
   * duration of the archive window length. This is duration that customer want
   * to retain the recorded content.
   *
   * @param {string} [parameters.manifestName] The manifest file name.
   *
   * @param {object} [parameters.hls] The HLS configuration.
   *
   * @param {number} [parameters.hls.fragmentsPerTsSegment] The amount of
   * fragments per HTTP Live Streaming (HLS) segment.
   *
   * @param {number} [parameters.outputSnapTime] The output snapshot time.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<LiveOutput>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  createWithHttpOperationResponse(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._create(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * Creates a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} parameters Live Output properties needed for creation.
   *
   * @param {string} [parameters.description] The description of the Live Output.
   *
   * @param {string} [parameters.assetName] The asset name.
   *
   * @param {moment.duration} [parameters.archiveWindowLength] ISO 8601 timespan
   * duration of the archive window length. This is duration that customer want
   * to retain the recorded content.
   *
   * @param {string} [parameters.manifestName] The manifest file name.
   *
   * @param {object} [parameters.hls] The HLS configuration.
   *
   * @param {number} [parameters.hls.fragmentsPerTsSegment] The amount of
   * fragments per HTTP Live Streaming (HLS) segment.
   *
   * @param {number} [parameters.outputSnapTime] The output snapshot time.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {LiveOutput} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link LiveOutput} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  create(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._create(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._create(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, optionalCallback);
    }
  }

  /**
   * Deletes a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<null>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  deleteMethodWithHttpOperationResponse(resourceGroupName, accountName, liveEventName, liveOutputName, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._deleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * Deletes a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {null} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {null} [result]   - The deserialized result object if an error did not occur.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._deleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._deleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, optionalCallback);
    }
  }

  /**
   * Creates a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} parameters Live Output properties needed for creation.
   *
   * @param {string} [parameters.description] The description of the Live Output.
   *
   * @param {string} [parameters.assetName] The asset name.
   *
   * @param {moment.duration} [parameters.archiveWindowLength] ISO 8601 timespan
   * duration of the archive window length. This is duration that customer want
   * to retain the recorded content.
   *
   * @param {string} [parameters.manifestName] The manifest file name.
   *
   * @param {object} [parameters.hls] The HLS configuration.
   *
   * @param {number} [parameters.hls.fragmentsPerTsSegment] The amount of
   * fragments per HTTP Live Streaming (HLS) segment.
   *
   * @param {number} [parameters.outputSnapTime] The output snapshot time.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<LiveOutput>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  beginCreateWithHttpOperationResponse(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._beginCreate(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * Creates a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} parameters Live Output properties needed for creation.
   *
   * @param {string} [parameters.description] The description of the Live Output.
   *
   * @param {string} [parameters.assetName] The asset name.
   *
   * @param {moment.duration} [parameters.archiveWindowLength] ISO 8601 timespan
   * duration of the archive window length. This is duration that customer want
   * to retain the recorded content.
   *
   * @param {string} [parameters.manifestName] The manifest file name.
   *
   * @param {object} [parameters.hls] The HLS configuration.
   *
   * @param {number} [parameters.hls.fragmentsPerTsSegment] The amount of
   * fragments per HTTP Live Streaming (HLS) segment.
   *
   * @param {number} [parameters.outputSnapTime] The output snapshot time.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {LiveOutput} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link LiveOutput} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  beginCreate(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._beginCreate(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._beginCreate(resourceGroupName, accountName, liveEventName, liveOutputName, parameters, options, optionalCallback);
    }
  }

  /**
   * Deletes a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<null>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  beginDeleteMethodWithHttpOperationResponse(resourceGroupName, accountName, liveEventName, liveOutputName, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._beginDeleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * Deletes a Live Output.
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} liveEventName The name of the Live Event.
   *
   * @param {string} liveOutputName The name of the Live Output.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {null} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {null} [result]   - The deserialized result object if an error did not occur.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  beginDeleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._beginDeleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._beginDeleteMethod(resourceGroupName, accountName, liveEventName, liveOutputName, options, optionalCallback);
    }
  }

  /**
   * Lists the Live Outputs in the Live Event.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<LiveOutputListResult>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  listNextWithHttpOperationResponse(nextPageLink, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._listNext(nextPageLink, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * Lists the Live Outputs in the Live Event.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {LiveOutputListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link LiveOutputListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  listNext(nextPageLink, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._listNext(nextPageLink, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._listNext(nextPageLink, options, optionalCallback);
    }
  }

}

module.exports = LiveOutputs;
