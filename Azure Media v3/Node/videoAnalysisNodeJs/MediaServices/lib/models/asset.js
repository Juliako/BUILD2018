/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 */

'use strict';

const models = require('./index');

/**
 * An Asset.
 *
 * @extends models['ProxyResource']
 */
class Asset extends models['ProxyResource'] {
  /**
   * Create a Asset.
   * @member {uuid} [assetId] The Asset ID.
   * @member {date} [created] The creation date of the Asset.
   * @member {date} [lastModified] The last modified date of the Asset.
   * @member {string} [alternateId] The alternate ID of the Asset.
   * @member {string} [description] The Asset description.
   * @member {string} [container] The name of the asset blob container.
   * @member {string} [storageAccountId] The ARM resource ID of the Azure
   * Storage account containing the Asset.
   * @member {string} [storageEncryptionFormat] The Asset encryption format.
   * One of None, MediaStorageEncryption, StaticCommonEncryption or
   * StaticEnvelopeEncryption. Possible values include: 'None',
   * 'MediaStorageClientEncryption', 'StaticCommonEncryption',
   * 'StaticEnvelopeEncryption'
   * @member {string} [storageEncryptionKey] The Base64 encoded key for the
   * Asset storage encryption.
   */
  constructor() {
    super();
  }

  /**
   * Defines the metadata of Asset
   *
   * @returns {object} metadata of Asset
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'Asset',
      type: {
        name: 'Composite',
        className: 'Asset',
        modelProperties: {
          id: {
            required: false,
            readOnly: true,
            serializedName: 'id',
            type: {
              name: 'String'
            }
          },
          name: {
            required: false,
            readOnly: true,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          type: {
            required: false,
            readOnly: true,
            serializedName: 'type',
            type: {
              name: 'String'
            }
          },
          assetId: {
            required: false,
            readOnly: true,
            serializedName: 'properties.assetId',
            type: {
              name: 'String'
            }
          },
          created: {
            required: false,
            readOnly: true,
            serializedName: 'properties.created',
            type: {
              name: 'DateTime'
            }
          },
          lastModified: {
            required: false,
            readOnly: true,
            serializedName: 'properties.lastModified',
            type: {
              name: 'DateTime'
            }
          },
          alternateId: {
            required: false,
            serializedName: 'properties.alternateId',
            type: {
              name: 'String'
            }
          },
          description: {
            required: false,
            serializedName: 'properties.description',
            type: {
              name: 'String'
            }
          },
          container: {
            required: false,
            serializedName: 'properties.container',
            type: {
              name: 'String'
            }
          },
          storageAccountId: {
            required: false,
            serializedName: 'properties.storageAccountId',
            type: {
              name: 'String'
            }
          },
          storageEncryptionFormat: {
            required: false,
            serializedName: 'properties.storageEncryptionFormat',
            type: {
              name: 'String'
            }
          },
          storageEncryptionKey: {
            required: false,
            serializedName: 'properties.storageEncryptionKey',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = Asset;
