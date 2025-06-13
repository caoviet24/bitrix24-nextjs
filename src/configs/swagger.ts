// Add server-only directive to ensure this only runs on the server
import 'server-only';
import { createSwaggerSpec } from 'next-swagger-doc';

/**
 * Generate the Swagger API documentation
 * This function must only be called on the server
 */
export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: 'src/app/api', // define api folder under app folder
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'CRM API Documentation',
                description: 'API documentation for the CRM application',
                version: '1.0',
                contact: {
                    name: 'API Support',
                    email: 'support@example.com',
                },
            },
            servers: [
                {
                    url: '/api',
                    description: 'Current environment',
                },
            ],
            tags: [
                {
                    name: 'Contacts',
                    description: 'Operations related to contacts',
                },
                {
                    name: 'Requisites',
                    description: 'Operations related to requisites',
                },
                {
                    name: 'Bank Details',
                    description: 'Operations related to bank details',
                },
            ],
            components: {
                securitySchemes: {
                    accessToken: {
                        type: 'apiKey',
                        in: 'query',
                        name: 'access_token',
                    },
                },
                schemas: {
                    Error: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                            },
                            details: {
                                type: 'string',
                            },
                            success: {
                                type: 'boolean',
                                default: false,
                            },
                        },
                    },
                    Contact: {
                        type: 'object',
                        properties: {
                            ID: { type: 'string' },
                            NAME: { type: 'string' },
                            PHONE: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        ID: { type: 'string' },
                                        VALUE: { type: 'string' },
                                        VALUE_TYPE: { type: 'string' },
                                        TYPE_ID: { type: 'string' },
                                    },
                                },
                            },
                            EMAIL: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        ID: { type: 'string' },
                                        VALUE: { type: 'string' },
                                        VALUE_TYPE: { type: 'string' },
                                        TYPE_ID: { type: 'string' },
                                    },
                                },
                            },
                            WEB: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        ID: { type: 'string' },
                                        VALUE: { type: 'string' },
                                        VALUE_TYPE: { type: 'string' },
                                        TYPE_ID: { type: 'string' },
                                    },
                                },
                            },
                            ADDRESS: { type: 'string' },
                            REQUISITES: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/Requisite',
                                },
                            },
                        },
                    },
                    Requisite: {
                        type: 'object',
                        properties: {
                            ID: { type: 'string' },
                            ENTITY_TYPE_ID: { type: 'string' },
                            ENTITY_ID: { type: 'string' },
                            PRESET_ID: { type: 'string' },
                            BANK_DETAIL: {
                                $ref: '#/components/schemas/BankDetail',
                            },
                        },
                    },
                    BankDetail: {
                        type: 'object',
                        properties: {
                            ID: { type: 'string' },
                            ENTITY_ID: { type: 'string' },
                            NAME: { type: 'string' },
                            RQ_BANK_NAME: { type: 'string' },
                            RQ_ACC_NUM: { type: 'string' },
                        },
                    },
                },
            },
            security: [
                {
                    accessToken: [],
                },
            ],
        },
    });
    return spec;
};
