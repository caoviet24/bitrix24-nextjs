import { NextRequest } from 'next/server';
import { ContactController } from '../controllers/contact.controller';

const contactController = new ContactController();

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     description: Update an existing contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
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
 *                         ID:
 *                           type: string
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
 *                         ID:
 *                           type: string
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
 *                         ID:
 *                           type: string
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
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updated:
 *                   type: boolean
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log(`Updating contact with ID: ${id}`, request.body);
    return contactController.updateContact(request, id);
}

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     description: Delete an existing contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *       - name: access_token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deleted:
 *                   type: boolean
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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return contactController.deleteContact(request, id);
}
