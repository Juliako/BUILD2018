/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 */

'use strict';

/**
 * The Asset Storage container SAS URLs.
 *
 */
class AssetContainerSas {
  /**
   * Create a AssetContainerSas.
   * @member {array} [assetContainerSasUrls] The list of Asset container SAS
   * URLs.
   */
  constructor() {
  }

  /**
   * Defines the metadata of AssetContainerSas
   *
   * @returns {object} metadata of AssetContainerSas
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'AssetContainerSas',
      type: {
        name: 'Composite',
        className: 'AssetContainerSas',
        modelProperties: {
          assetContainerSasUrls: {
            required: false,
            serializedName: 'assetContainerSasUrls',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'StringElementType',
                  type: {
                    name: 'String'
                  }
              }
            }
          }
        }
      }
    };
  }
}

module.exports = AssetContainerSas;
