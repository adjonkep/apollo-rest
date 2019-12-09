import { RESTDataSource } from 'apollo-datasource-rest';

export default class OwnerAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:6000/';
  }

  async getAllOwners() {
    return this.get('owners', null, {cacheOptions: { ttl: 600 }});
  }

};
