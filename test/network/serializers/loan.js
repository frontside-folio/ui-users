import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    json.totalRecords = json.loans.length;

    json.loans.forEach(loan => {
      const userId = loan.user;
      delete loan.user;
      loan.userId = userId;
    });

    return json;
  }
});