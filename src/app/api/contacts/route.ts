import { NextRequest } from 'next/server';
import { ContactController } from './controllers/contact.controller';

const contactController = new ContactController();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get a list of contacts with optional filtering
 *     description: Retrieve a list of contacts with options for filtering by name, email, phone, province, bank name, and account number.
 *     tags: [Contacts]
 *     parameters:
 *       - name: access_token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term for contact name
 *       - name: filters
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: JSON string with filter options (province, phone, email, bankName, accountNumber)
 *       - name: start
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination start index
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     start:
 *                       type: integer
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
    return contactController.getContacts(request);
}

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     description: Create a new contact with optional bank details
 *     tags: [Contacts]
 *     parameters:
 *       - name: access_token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contact
 *             properties:
 *               contact:
 *                 type: object
 *                 properties:
 *                   NAME:
 *                     type: string
 *                   PHONE:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         VALUE:
 *                           type: string
 *                         VALUE_TYPE:
 *                           type: string
 *                           default: WORK
 *                   EMAIL:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         VALUE:
 *                           type: string
 *                         VALUE_TYPE:
 *                           type: string
 *                           default: WORK
 *                   WEB:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         VALUE:
 *                           type: string
 *                         VALUE_TYPE:
 *                           type: string
 *                           default: WORK
 *                   UF_CRM_1749491137:
 *                     type: string
 *                     description: Address
 *                   REQUISITES:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         BANK_DETAIL:
 *                           type: object
 *                           properties:
 *                             RQ_BANK_NAME:
 *                               type: string
 *                             RQ_ACC_NUM:
 *                               type: string
 *     responses:
 *       200:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 contactId:
 *                   type: string
 *                 requisiteId:
 *                   type: string
 *                 bankDetailId:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
    return contactController.createContact(request);
}
