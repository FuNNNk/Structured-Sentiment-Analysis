import { User } from './user-model';

describe('UserClass', () => {
  it('should create an instance', () => {
    expect(new User()).toBeTruthy();
  });
});
