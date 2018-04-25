/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 */

'use strict';

const msRest = require('ms-rest');
const msRestAzure = require('ms-rest-azure');
const WebResource = msRest.WebResource;

/**
 * @summary List Streaming Policies
 *
 * Lists the Streaming Policies in the account
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {object} [options] Optional Parameters.
 *
 * @param {string} [options.filter] Restricts the set of items returned.
 *
 * @param {number} [options.top] Specifies a non-negative integer n that limits
 * the number of items returned from a collection. The service returns the
 * number of available items up to but not greater than the specified value n.
 *
 * @param {string} [options.orderby] Specifies the the key by which the result
 * collection should be ordered.
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
 *                      See {@link StreamingPolicyCollection} for more
 *                      information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _list(resourceGroupName, accountName, options, callback) {
   /* jshint validthis: true */
  let client = this.client;
  if(!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('callback cannot be null.');
  }
  let filter = (options && options.filter !== undefined) ? options.filter : undefined;
  let top = (options && options.top !== undefined) ? options.top : undefined;
  let orderby = (options && options.orderby !== undefined) ? options.orderby : undefined;
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
    if (this.client.apiVersion === null || this.client.apiVersion === undefined || typeof this.client.apiVersion.valueOf() !== 'string') {
      throw new Error('this.client.apiVersion cannot be null or undefined and it must be of type string.');
    }
    if (filter !== null && filter !== undefined && typeof filter.valueOf() !== 'string') {
      throw new Error('filter must be of type string.');
    }
    if (top !== null && top !== undefined && typeof top !== 'number') {
      throw new Error('top must be of type number.');
    }
    if (orderby !== null && orderby !== undefined && typeof orderby.valueOf() !== 'string') {
      throw new Error('orderby must be of type string.');
    }
    if (this.client.acceptLanguage !== null && this.client.acceptLanguage !== undefined && typeof this.client.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.client.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let baseUrl = this.client.baseUri;
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/streamingPolicies';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  let queryParameters = [];
  queryParameters.push('api-version=' + encodeURIComponent(this.client.apiVersion));
  if (filter !== null && filter !== undefined) {
    queryParameters.push('$filter=' + encodeURIComponent(filter));
  }
  if (top !== null && top !== undefined) {
    queryParameters.push('$top=' + encodeURIComponent(top.toString()));
  }
  if (orderby !== null && orderby !== undefined) {
    queryParameters.push('$orderby=' + encodeURIComponent(orderby));
  }
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
          let resultMapper = new client.models['StreamingPolicyCollection']().mapper();
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
 * @summary Get a Streaming Policy
 *
 * Get the details of a Streaming Policy in the Media Services account
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} streamingPolicyName The Streaming Policy name.
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
 *                      See {@link StreamingPolicy} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _get(resourceGroupName, accountName, streamingPolicyName, options, callback) {
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
    if (streamingPolicyName === null || streamingPolicyName === undefined || typeof streamingPolicyName.valueOf() !== 'string') {
      throw new Error('streamingPolicyName cannot be null or undefined and it must be of type string.');
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
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/streamingPolicies/{streamingPolicyName}';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  requestUrl = requestUrl.replace('{streamingPolicyName}', encodeURIComponent(streamingPolicyName));
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
          let resultMapper = new client.models['StreamingPolicy']().mapper();
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
 * @summary Create a Streaming Policy
 *
 * Create a Streaming Policy in the Media Services account
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} streamingPolicyName The Streaming Policy name.
 *
 * @param {object} parameters The request parameters
 *
 * @param {string} [parameters.defaultContentKeyPolicyName] Default ContentKey
 * used by current Streaming Policy
 *
 * @param {object} [parameters.envelopeEncryption] Configuration of
 * EnvelopeEncryption
 *
 * @param {object} [parameters.envelopeEncryption.enabledProtocols]
 * Representing supported protocols
 *
 * @param {array} [parameters.envelopeEncryption.clearTracks] Representing
 * which tracks should not be encrypted
 *
 * @param {object} [parameters.envelopeEncryption.contentKeys] Representing
 * default content key for each encryption scheme and separate content keys for
 * specific tracks
 *
 * @param {string}
 * [parameters.envelopeEncryption.customLicenseAcquisitionUrlTemplate] The
 * template for a customer service to deliver keys to end users.  Not needed if
 * using the built in Key Delivery service.
 *
 * @param {object} [parameters.commonEncryptionCenc] Configuration of
 * CommonEncryptionCenc
 *
 * @param {object} [parameters.commonEncryptionCenc.enabledProtocols]
 * Representing supported protocols
 *
 * @param {array} [parameters.commonEncryptionCenc.clearTracks] Representing
 * which tracks should not be encrypted
 *
 * @param {object} [parameters.commonEncryptionCenc.contentKeys] Representing
 * default content key for each encryption scheme and separate content keys for
 * specific tracks
 *
 * @param {object} [parameters.commonEncryptionCenc.drm] Represents
 * configuration specific to Dynamic Encryption using the scheme defined in
 * ISO/IEC 23001-7 (also known as MPEG Common Encryption) using the 'cbcs'
 * scheme.
 *
 * @param {object} [parameters.commonEncryptionCenc.drm.playReady] PlayReady
 * configurations
 *
 * @param {object} [parameters.commonEncryptionCenc.drm.widevine] Widevine
 * configurations
 *
 * @param {object} [parameters.commonEncryptionCbcs] Configuration of
 * CommonEncryptionCbcs
 *
 * @param {object} [parameters.commonEncryptionCbcs.enabledProtocols]
 * Representing supported protocols
 *
 * @param {array} [parameters.commonEncryptionCbcs.clearTracks] Representing
 * which tracks should not be encrypted
 *
 * @param {object} [parameters.commonEncryptionCbcs.contentKeys] Representing
 * default content key for each encryption scheme and separate content keys for
 * specific tracks
 *
 * @param {object} [parameters.commonEncryptionCbcs.contentKeys.defaultKey]
 * Default content key for an encryption scheme
 *
 * @param {string}
 * [parameters.commonEncryptionCbcs.contentKeys.defaultKey.label] Label can be
 * used to specify Content Key when creating Stremaing Locator
 *
 * @param {string}
 * [parameters.commonEncryptionCbcs.contentKeys.defaultKey.policyName] Policy
 * used by Default Key
 *
 * @param {array}
 * [parameters.commonEncryptionCbcs.contentKeys.keyToTrackMappings]
 * Representing tracks needs sepearete content key
 *
 * @param {object} [parameters.commonEncryptionCbcs.drm] Configuration of DRMs
 * for current encryption scheme
 *
 * @param {object} [parameters.commonEncryptionCbcs.drm.fairPlay] Fairplay
 * configurations
 *
 * @param {string}
 * [parameters.commonEncryptionCbcs.drm.fairPlay.customLicenseAcquisitionUrlTemplate]
 * The template for a customer service to deliver keys to end users.  Not
 * needed if using the built in Key Delivery service.
 *
 * @param {boolean}
 * parameters.commonEncryptionCbcs.drm.fairPlay.allowPersistentLicense All
 * license to be persistent or not
 *
 * @param {object} [parameters.commonEncryptionCbcs.drm.playReady] PlayReady
 * configurations
 *
 * @param {string}
 * [parameters.commonEncryptionCbcs.drm.playReady.customLicenseAcquisitionUrlTemplate]
 * The template for a customer service to deliver keys to end users.  Not
 * needed if using the built in Key Delivery service.
 *
 * @param {string}
 * [parameters.commonEncryptionCbcs.drm.playReady.playReadyCustomAttributes]
 * Custom attributes for PlayReady
 *
 * @param {object} [parameters.commonEncryptionCbcs.drm.widevine] Widevine
 * configurations
 *
 * @param {string}
 * [parameters.commonEncryptionCbcs.drm.widevine.customLicenseAcquisitionUrlTemplate]
 * The template for a customer service to deliver keys to end users.  Not
 * needed if using the built in Key Delivery service.
 *
 * @param {object} [parameters.noEncryption] Configuations of NoEncryption
 *
 * @param {object} [parameters.noEncryption.enabledProtocols] Representing
 * supported protocols
 *
 * @param {boolean} parameters.noEncryption.enabledProtocols.download Enable
 * Download protocol or not
 *
 * @param {boolean} parameters.noEncryption.enabledProtocols.dash Enable Dash
 * protocol or not
 *
 * @param {boolean} parameters.noEncryption.enabledProtocols.hls Enable Hls
 * protocol or not
 *
 * @param {boolean} parameters.noEncryption.enabledProtocols.smoothStreaming
 * Enable SmoothStreaming protocol or not
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
 *                      See {@link StreamingPolicy} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _create(resourceGroupName, accountName, streamingPolicyName, parameters, options, callback) {
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
    if (streamingPolicyName === null || streamingPolicyName === undefined || typeof streamingPolicyName.valueOf() !== 'string') {
      throw new Error('streamingPolicyName cannot be null or undefined and it must be of type string.');
    }
    if (parameters === null || parameters === undefined) {
      throw new Error('parameters cannot be null or undefined.');
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
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/streamingPolicies/{streamingPolicyName}';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  requestUrl = requestUrl.replace('{streamingPolicyName}', encodeURIComponent(streamingPolicyName));
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
      let requestModelMapper = new client.models['StreamingPolicy']().mapper();
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
    if (statusCode !== 201) {
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
    if (statusCode === 201) {
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined) {
          let resultMapper = new client.models['StreamingPolicy']().mapper();
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
 * @summary Delete a Streaming Policy
 *
 * Deletes a Streaming Policy in the Media Services account
 *
 * @param {string} resourceGroupName The name of the resource group within the
 * Azure subscription.
 *
 * @param {string} accountName The Media Services account name.
 *
 * @param {string} streamingPolicyName The Streaming Policy name.
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
function _deleteMethod(resourceGroupName, accountName, streamingPolicyName, options, callback) {
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
    if (streamingPolicyName === null || streamingPolicyName === undefined || typeof streamingPolicyName.valueOf() !== 'string') {
      throw new Error('streamingPolicyName cannot be null or undefined and it must be of type string.');
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
  let requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/streamingPolicies/{streamingPolicyName}';
  requestUrl = requestUrl.replace('{subscriptionId}', encodeURIComponent(this.client.subscriptionId));
  requestUrl = requestUrl.replace('{resourceGroupName}', encodeURIComponent(resourceGroupName));
  requestUrl = requestUrl.replace('{accountName}', encodeURIComponent(accountName));
  requestUrl = requestUrl.replace('{streamingPolicyName}', encodeURIComponent(streamingPolicyName));
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
    if (statusCode !== 200 && statusCode !== 204) {
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
 * @summary List Streaming Policies
 *
 * Lists the Streaming Policies in the account
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
 *                      See {@link StreamingPolicyCollection} for more
 *                      information.
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
          let resultMapper = new client.models['StreamingPolicyCollection']().mapper();
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

/** Class representing a StreamingPolicies. */
class StreamingPolicies {
  /**
   * Create a StreamingPolicies.
   * @param {AzureMediaServices} client Reference to the service client.
   */
  constructor(client) {
    this.client = client;
    this._list = _list;
    this._get = _get;
    this._create = _create;
    this._deleteMethod = _deleteMethod;
    this._listNext = _listNext;
  }

  /**
   * @summary List Streaming Policies
   *
   * Lists the Streaming Policies in the account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.filter] Restricts the set of items returned.
   *
   * @param {number} [options.top] Specifies a non-negative integer n that limits
   * the number of items returned from a collection. The service returns the
   * number of available items up to but not greater than the specified value n.
   *
   * @param {string} [options.orderby] Specifies the the key by which the result
   * collection should be ordered.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<StreamingPolicyCollection>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  listWithHttpOperationResponse(resourceGroupName, accountName, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._list(resourceGroupName, accountName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * @summary List Streaming Policies
   *
   * Lists the Streaming Policies in the account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.filter] Restricts the set of items returned.
   *
   * @param {number} [options.top] Specifies a non-negative integer n that limits
   * the number of items returned from a collection. The service returns the
   * number of available items up to but not greater than the specified value n.
   *
   * @param {string} [options.orderby] Specifies the the key by which the result
   * collection should be ordered.
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
   *                      @resolve {StreamingPolicyCollection} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link StreamingPolicyCollection} for more
   *                      information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  list(resourceGroupName, accountName, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._list(resourceGroupName, accountName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._list(resourceGroupName, accountName, options, optionalCallback);
    }
  }

  /**
   * @summary Get a Streaming Policy
   *
   * Get the details of a Streaming Policy in the Media Services account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} streamingPolicyName The Streaming Policy name.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<StreamingPolicy>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  getWithHttpOperationResponse(resourceGroupName, accountName, streamingPolicyName, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._get(resourceGroupName, accountName, streamingPolicyName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * @summary Get a Streaming Policy
   *
   * Get the details of a Streaming Policy in the Media Services account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} streamingPolicyName The Streaming Policy name.
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
   *                      @resolve {StreamingPolicy} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link StreamingPolicy} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  get(resourceGroupName, accountName, streamingPolicyName, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._get(resourceGroupName, accountName, streamingPolicyName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._get(resourceGroupName, accountName, streamingPolicyName, options, optionalCallback);
    }
  }

  /**
   * @summary Create a Streaming Policy
   *
   * Create a Streaming Policy in the Media Services account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} streamingPolicyName The Streaming Policy name.
   *
   * @param {object} parameters The request parameters
   *
   * @param {string} [parameters.defaultContentKeyPolicyName] Default ContentKey
   * used by current Streaming Policy
   *
   * @param {object} [parameters.envelopeEncryption] Configuration of
   * EnvelopeEncryption
   *
   * @param {object} [parameters.envelopeEncryption.enabledProtocols]
   * Representing supported protocols
   *
   * @param {array} [parameters.envelopeEncryption.clearTracks] Representing
   * which tracks should not be encrypted
   *
   * @param {object} [parameters.envelopeEncryption.contentKeys] Representing
   * default content key for each encryption scheme and separate content keys for
   * specific tracks
   *
   * @param {string}
   * [parameters.envelopeEncryption.customLicenseAcquisitionUrlTemplate] The
   * template for a customer service to deliver keys to end users.  Not needed if
   * using the built in Key Delivery service.
   *
   * @param {object} [parameters.commonEncryptionCenc] Configuration of
   * CommonEncryptionCenc
   *
   * @param {object} [parameters.commonEncryptionCenc.enabledProtocols]
   * Representing supported protocols
   *
   * @param {array} [parameters.commonEncryptionCenc.clearTracks] Representing
   * which tracks should not be encrypted
   *
   * @param {object} [parameters.commonEncryptionCenc.contentKeys] Representing
   * default content key for each encryption scheme and separate content keys for
   * specific tracks
   *
   * @param {object} [parameters.commonEncryptionCenc.drm] Represents
   * configuration specific to Dynamic Encryption using the scheme defined in
   * ISO/IEC 23001-7 (also known as MPEG Common Encryption) using the 'cbcs'
   * scheme.
   *
   * @param {object} [parameters.commonEncryptionCenc.drm.playReady] PlayReady
   * configurations
   *
   * @param {object} [parameters.commonEncryptionCenc.drm.widevine] Widevine
   * configurations
   *
   * @param {object} [parameters.commonEncryptionCbcs] Configuration of
   * CommonEncryptionCbcs
   *
   * @param {object} [parameters.commonEncryptionCbcs.enabledProtocols]
   * Representing supported protocols
   *
   * @param {array} [parameters.commonEncryptionCbcs.clearTracks] Representing
   * which tracks should not be encrypted
   *
   * @param {object} [parameters.commonEncryptionCbcs.contentKeys] Representing
   * default content key for each encryption scheme and separate content keys for
   * specific tracks
   *
   * @param {object} [parameters.commonEncryptionCbcs.contentKeys.defaultKey]
   * Default content key for an encryption scheme
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.contentKeys.defaultKey.label] Label can be
   * used to specify Content Key when creating Stremaing Locator
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.contentKeys.defaultKey.policyName] Policy
   * used by Default Key
   *
   * @param {array}
   * [parameters.commonEncryptionCbcs.contentKeys.keyToTrackMappings]
   * Representing tracks needs sepearete content key
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm] Configuration of DRMs
   * for current encryption scheme
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm.fairPlay] Fairplay
   * configurations
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.fairPlay.customLicenseAcquisitionUrlTemplate]
   * The template for a customer service to deliver keys to end users.  Not
   * needed if using the built in Key Delivery service.
   *
   * @param {boolean}
   * parameters.commonEncryptionCbcs.drm.fairPlay.allowPersistentLicense All
   * license to be persistent or not
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm.playReady] PlayReady
   * configurations
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.playReady.customLicenseAcquisitionUrlTemplate]
   * The template for a customer service to deliver keys to end users.  Not
   * needed if using the built in Key Delivery service.
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.playReady.playReadyCustomAttributes]
   * Custom attributes for PlayReady
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm.widevine] Widevine
   * configurations
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.widevine.customLicenseAcquisitionUrlTemplate]
   * The template for a customer service to deliver keys to end users.  Not
   * needed if using the built in Key Delivery service.
   *
   * @param {object} [parameters.noEncryption] Configuations of NoEncryption
   *
   * @param {object} [parameters.noEncryption.enabledProtocols] Representing
   * supported protocols
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.download Enable
   * Download protocol or not
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.dash Enable Dash
   * protocol or not
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.hls Enable Hls
   * protocol or not
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.smoothStreaming
   * Enable SmoothStreaming protocol or not
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<StreamingPolicy>} - The deserialized result object.
   *
   * @reject {Error} - The error object.
   */
  createWithHttpOperationResponse(resourceGroupName, accountName, streamingPolicyName, parameters, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._create(resourceGroupName, accountName, streamingPolicyName, parameters, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * @summary Create a Streaming Policy
   *
   * Create a Streaming Policy in the Media Services account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} streamingPolicyName The Streaming Policy name.
   *
   * @param {object} parameters The request parameters
   *
   * @param {string} [parameters.defaultContentKeyPolicyName] Default ContentKey
   * used by current Streaming Policy
   *
   * @param {object} [parameters.envelopeEncryption] Configuration of
   * EnvelopeEncryption
   *
   * @param {object} [parameters.envelopeEncryption.enabledProtocols]
   * Representing supported protocols
   *
   * @param {array} [parameters.envelopeEncryption.clearTracks] Representing
   * which tracks should not be encrypted
   *
   * @param {object} [parameters.envelopeEncryption.contentKeys] Representing
   * default content key for each encryption scheme and separate content keys for
   * specific tracks
   *
   * @param {string}
   * [parameters.envelopeEncryption.customLicenseAcquisitionUrlTemplate] The
   * template for a customer service to deliver keys to end users.  Not needed if
   * using the built in Key Delivery service.
   *
   * @param {object} [parameters.commonEncryptionCenc] Configuration of
   * CommonEncryptionCenc
   *
   * @param {object} [parameters.commonEncryptionCenc.enabledProtocols]
   * Representing supported protocols
   *
   * @param {array} [parameters.commonEncryptionCenc.clearTracks] Representing
   * which tracks should not be encrypted
   *
   * @param {object} [parameters.commonEncryptionCenc.contentKeys] Representing
   * default content key for each encryption scheme and separate content keys for
   * specific tracks
   *
   * @param {object} [parameters.commonEncryptionCenc.drm] Represents
   * configuration specific to Dynamic Encryption using the scheme defined in
   * ISO/IEC 23001-7 (also known as MPEG Common Encryption) using the 'cbcs'
   * scheme.
   *
   * @param {object} [parameters.commonEncryptionCenc.drm.playReady] PlayReady
   * configurations
   *
   * @param {object} [parameters.commonEncryptionCenc.drm.widevine] Widevine
   * configurations
   *
   * @param {object} [parameters.commonEncryptionCbcs] Configuration of
   * CommonEncryptionCbcs
   *
   * @param {object} [parameters.commonEncryptionCbcs.enabledProtocols]
   * Representing supported protocols
   *
   * @param {array} [parameters.commonEncryptionCbcs.clearTracks] Representing
   * which tracks should not be encrypted
   *
   * @param {object} [parameters.commonEncryptionCbcs.contentKeys] Representing
   * default content key for each encryption scheme and separate content keys for
   * specific tracks
   *
   * @param {object} [parameters.commonEncryptionCbcs.contentKeys.defaultKey]
   * Default content key for an encryption scheme
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.contentKeys.defaultKey.label] Label can be
   * used to specify Content Key when creating Stremaing Locator
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.contentKeys.defaultKey.policyName] Policy
   * used by Default Key
   *
   * @param {array}
   * [parameters.commonEncryptionCbcs.contentKeys.keyToTrackMappings]
   * Representing tracks needs sepearete content key
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm] Configuration of DRMs
   * for current encryption scheme
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm.fairPlay] Fairplay
   * configurations
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.fairPlay.customLicenseAcquisitionUrlTemplate]
   * The template for a customer service to deliver keys to end users.  Not
   * needed if using the built in Key Delivery service.
   *
   * @param {boolean}
   * parameters.commonEncryptionCbcs.drm.fairPlay.allowPersistentLicense All
   * license to be persistent or not
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm.playReady] PlayReady
   * configurations
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.playReady.customLicenseAcquisitionUrlTemplate]
   * The template for a customer service to deliver keys to end users.  Not
   * needed if using the built in Key Delivery service.
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.playReady.playReadyCustomAttributes]
   * Custom attributes for PlayReady
   *
   * @param {object} [parameters.commonEncryptionCbcs.drm.widevine] Widevine
   * configurations
   *
   * @param {string}
   * [parameters.commonEncryptionCbcs.drm.widevine.customLicenseAcquisitionUrlTemplate]
   * The template for a customer service to deliver keys to end users.  Not
   * needed if using the built in Key Delivery service.
   *
   * @param {object} [parameters.noEncryption] Configuations of NoEncryption
   *
   * @param {object} [parameters.noEncryption.enabledProtocols] Representing
   * supported protocols
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.download Enable
   * Download protocol or not
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.dash Enable Dash
   * protocol or not
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.hls Enable Hls
   * protocol or not
   *
   * @param {boolean} parameters.noEncryption.enabledProtocols.smoothStreaming
   * Enable SmoothStreaming protocol or not
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
   *                      @resolve {StreamingPolicy} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link StreamingPolicy} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  create(resourceGroupName, accountName, streamingPolicyName, parameters, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._create(resourceGroupName, accountName, streamingPolicyName, parameters, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._create(resourceGroupName, accountName, streamingPolicyName, parameters, options, optionalCallback);
    }
  }

  /**
   * @summary Delete a Streaming Policy
   *
   * Deletes a Streaming Policy in the Media Services account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} streamingPolicyName The Streaming Policy name.
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
  deleteMethodWithHttpOperationResponse(resourceGroupName, accountName, streamingPolicyName, options) {
    let client = this.client;
    let self = this;
    return new Promise((resolve, reject) => {
      self._deleteMethod(resourceGroupName, accountName, streamingPolicyName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

  /**
   * @summary Delete a Streaming Policy
   *
   * Deletes a Streaming Policy in the Media Services account
   *
   * @param {string} resourceGroupName The name of the resource group within the
   * Azure subscription.
   *
   * @param {string} accountName The Media Services account name.
   *
   * @param {string} streamingPolicyName The Streaming Policy name.
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
  deleteMethod(resourceGroupName, accountName, streamingPolicyName, options, optionalCallback) {
    let client = this.client;
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._deleteMethod(resourceGroupName, accountName, streamingPolicyName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._deleteMethod(resourceGroupName, accountName, streamingPolicyName, options, optionalCallback);
    }
  }

  /**
   * @summary List Streaming Policies
   *
   * Lists the Streaming Policies in the account
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
   * @resolve {HttpOperationResponse<StreamingPolicyCollection>} - The deserialized result object.
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
   * @summary List Streaming Policies
   *
   * Lists the Streaming Policies in the account
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
   *                      @resolve {StreamingPolicyCollection} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link StreamingPolicyCollection} for more
   *                      information.
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

module.exports = StreamingPolicies;
