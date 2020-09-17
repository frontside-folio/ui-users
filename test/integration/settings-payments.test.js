import { App } from '@bigtest/interactor';
import test from '../helpers/base-steps/simulate-server';
import { store, routes } from '../helpers/server';
import CQLParser from '../network/cql';

import {
  Alert,
  Button,
  Select,
  Table,
  TableCell,
  TableRow,
  TableRowGroup,
  TextField
} from '../interactors';

export default test('settings refunds')
  .step('seed data', async () => {
    store.create('user', { id: '1ad737b0-d847-11e6-bf26-cec0c932ce02' });
    store.create('owner', { owner: 'Main Admin0', desc: 'Owner FyF' });
    store.create('owner', { owner: 'Shared', desc: 'Owner Shared' });
    const owner1 = store.create('owner', { owner: 'Main Admin1', desc: 'Owner DGB' });
    const otherOwner = store.create('owner', { owner: 'Main Admin2', desc: 'Owner CCH' });
    const ownerFeeFine = store.create('owner', { owner: 'Main Admin3', desc: 'Owner DGB' });
    store.createList('feefine', 4, { ownerId: ownerFeeFine.id });
    store.createList('transfer', 2, { ownerId: owner1.id });
    store.createList('transfer', 3, { ownerId: otherOwner.id });
    store.createList('payment', 5, { ownerId: owner1.id });
    store.createList('refund', 5);
    store.createList('waiver', 5);
    store.createList('service-point', 3);
  })
  .step('query routes', async () => {
    routes.get('feefines');
    routes.post('feefine', (schema, request) => {
      const json = JSON.parse(request.requestBody);
      const record = store.create('feefine', json);
      return record.attrs;
    });
    routes.delete('feefines/:id');
    routes.put('feefines/:id', (schema, request) => {
      const {
        params: { id },
        requestBody,
      } = request;
      const model = schema.feefines.find(id);
      const json = JSON.parse(requestBody);
      model.update({ ...json });
      return model.attrs;
    });
    routes.get('owners');
    routes.post('owners', (schema, request) => {
      const json = JSON.parse(request.requestBody);
      const record = store.create('owner', json);
      return record.attrs;
    });
    routes.delete('/owners/:id', (schema, request) => {
      const matchingowner = schema.db.owners.find(request.params.id);
      const matchingfeefines = schema.db.feefines.where({ ownerId: request.params.id });
      if (matchingfeefines.length > 0) {
        return new Response(400, { 'Content-Type': 'application/json' }, JSON.stringify({
          errors: [{
            title: 'An error has occurred'
          }]
        }));
      }
      if (matchingowner != null) {
        return schema.db.owners.remove(request.params.id);
      }
      return matchingowner;
    });
    routes.put('owners/:id', (schema, request) => {
      const {
        params: { id },
        requestBody,
      } = request;
      const model = schema.owners.find(id);
      const json = JSON.parse(requestBody);
      model.update({ ...json });
      return model.attrs;
    });
    routes.get('/transfers', (schema, request) => {
      const url = new URL(request.url);
      const cqlQuery = url.searchParams.get('query');
      if (cqlQuery != null) {
        const cqlParser = new CQLParser();
        cqlParser.parse(cqlQuery);
        if (cqlParser.tree.field === 1) {
          return schema.transfers.all();
        }
        return schema.transfers.all();
      }
      return schema.transfers.all();
    });
    routes.post('/transfers', (schema, request) => {
      const body = JSON.parse(request.requestBody);
      return schema.transfers.create(body);
    });
    routes.put('/transfers/:id', ({ transfers }, request) => {
      const matching = transfers.find(request.params.id);
      const body = JSON.parse(request.requestBody);
      return matching.update(body);
    });
    routes.delete('/transfers/:id', (schema, request) => {
      return schema.db.transfers.remove(request.params.id);
    });
    routes.get('/refunds', (schema, request) => {
      const url = new URL(request.url);
      const cqlQuery = url.searchParams.get('query');
      if (cqlQuery != null) {
        const cqlParser = new CQLParser();
        cqlParser.parse(cqlQuery);
        if (cqlParser.tree.field === 1) {
          return schema.refunds.all();
        }
        return schema.refunds.all();
      }
      return schema.refunds.all();
    });
    routes.post('/refunds', (schema, request) => {
      const body = JSON.parse(request.requestBody);
      return schema.refunds.create(body);
    });
    routes.put('/refunds/:id', ({ refunds }, request) => {
      const matching = refunds.find(request.params.id);
      const body = JSON.parse(request.requestBody);
      return matching.update(body);
    });
    routes.delete('/refunds/:id', (schema, request) => {
      return schema.db.refunds.remove(request.params.id);
    });
    routes.get('/waives', (schema, request) => {
      const url = new URL(request.url);
      const cqlQuery = url.searchParams.get('query');
      if (cqlQuery != null) {
        const cqlParser = new CQLParser();
        cqlParser.parse(cqlQuery);
        if (cqlParser.tree.field === 1) {
          return schema.waivers.all();
        }
        return schema.waivers.all();
      }
      return schema.waivers.all();
    });
    routes.post('/waives', (schema, request) => {
      const body = JSON.parse(request.requestBody);
      return schema.waivers.create(body);
    });
    routes.put('/waives/:id', ({ waivers }, request) => {
      const matching = waivers.find(request.params.id);
      const body = JSON.parse(request.requestBody);
      return matching.update(body);
    });
    routes.delete('/waives/:id', (schema, request) => {
      return schema.db.waivers.remove(request.params.id);
    });
    routes.get('/payments', (schema, request) => {
      const url = new URL(request.url);
      const cqlQuery = url.searchParams.get('query');
      if (cqlQuery != null) {
        const cqlParser = new CQLParser();
        cqlParser.parse(cqlQuery);
        if (cqlParser.tree.field === 1) {
          return schema.payments.all();
        }
        return schema.payments.all();
      }
      return schema.payments.all();
    });
    routes.post('/payments', (schema, request) => {
      const body = JSON.parse(request.requestBody);
      return schema.payments.create(body);
    });
    routes.put('/payments/:id', ({ payments }, request) => {
      const matching = payments.find(request.params.id);
      const body = JSON.parse(request.requestBody);
      return matching.update(body);
    });
    routes.delete('/payments/:id', (schema, request) => {
      return schema.db.payments.remove(request.params.id);
    });
  })
  .step(App.visit('/settings/users/payments'))
  .step(Select.findById('select-owner').select('Main Admin1'))
  .assertion(TableRowGroup().has({ dataRowContainerCount: 5 }))
  .assertion(Table('editList-settings-payments', { dataColumnCount: 4 }).exists())
  .assertion(TableRow.findByDataRowIndex('row-0').find(TableCell('Cash0')).exists())
  .assertion(TableRow.findByDataRowIndex('row-0').find(TableCell('No')).exists())
  .child('delete', test => test
    .step(Button.findById('clickable-delete-settings-payments-0').click())
    .child('cancel delete', test => test
      .step(Button('Cancel').click())
      .assertion(TableRowGroup().has({ dataRowContainerCount: 5 })))
    .child('confirm delete', test => test
      .step(Button('Delete').click())
      .assertion(TableRowGroup().has({ dataRowContainerCount: 4 }))))
  .child('edit', test => test
    .step(Button.findById('clickable-edit-settings-payments-0').click())
    .step(TextField.findByPlaceholder('nameMethod').fill('Cash10'))
    .step(Select.findByName('items[0].allowedRefundMethod').select('Yes'))
    .child('cancel edit', test => test
      .step(Button('Cancel').click())
      .assertion(TableRow.findByDataRowIndex('row-0').find(TableCell('Cash0')).exists())
      .assertion(TableRow.findByDataRowIndex('row-0').find(TableCell('No')).exists()))
    .child('confirm edit', test => test
      .step(Button('Save').click())
      .assertion(TableRow.findByDataRowIndex('row-0').find(TableCell('Cash10')).exists())
      .assertion(TableRow.findByDataRowIndex('row-0').find(TableCell('Yes')).exists())))
  .child('add a payment', test => test
    .step(Button.findById('clickable-add-settings-payments').click())
    .step(TextField.findByPlaceholder('nameMethod').fill('Cash10'))
    .step(Select.findByName('items[0].allowedRefundMethod').select('Yes'))
    .step(Button('Save').click())
    .assertion(TableRow.findByDataRowIndex('row-5').find(TableCell('Cash10')).exists())
    .assertion(TableRow.findByDataRowIndex('row-5').find(TableCell('Yes')).exists()))
  .child('add a pre-existing payment', test => test
    .step(Button.findById('clickable-add-settings-payments').click())
    .step(TextField.findByPlaceholder('nameMethod').fill('Cash2'))
    .assertion(Alert('Payment method already exists').exists()));