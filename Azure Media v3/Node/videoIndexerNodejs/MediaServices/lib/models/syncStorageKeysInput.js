/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 */

'use strict';

/**
 * The input to the sync storage keys request.
 *
 */
class SyncStorageKeysInput {
  /**
   * Create a SyncStorageKeysInput.
   * @member {string} [id] The ID of the storage account resource.
   */
  constructor() {
  }

  /**
   * Defines the metadata of SyncStorageKeysInput
   *
   * @returns {object} metadata of SyncStorageKeysInput
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'SyncStorageKeysInput',
      type: {
        name: 'Composite',
        className: 'SyncStorageKeysInput',
        modelProperties: {
          id: {
            required: false,
            serializedName: 'id',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = SyncStorageKeysInput;
