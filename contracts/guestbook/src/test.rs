#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn setup(env: &Env) -> (Address, Address, soroban_sdk::token::Client<'static>) {
  env.mock_all_auths();
  let admin = Address::generate(env);
  let user = Address::generate(env);
  let sac = env.register_stellar_asset_contract_v2(admin.clone());
  let token = soroban_sdk::token::Client::new(env, &sac.address());
  (admin, user, token)
}

#[test]
fn sign_and_read_messages() {
  let env = Env::default();
  let (admin, user, token) = setup(&env);
  let contract_id = env.register(
    Guestbook,
    (admin.clone(), token.address.clone()),
  );
  let client = GuestbookClient::new(&env, &contract_id);

  client.sign_guestbook(&user, &String::from_str(&env, "Hello Stellar!"), &0);
  client.sign_guestbook(
    &user,
    &String::from_str(&env, "Second message"),
    &0,
  );

  let messages = client.get_messages();
  assert_eq!(messages.len(), 2);
  assert_eq!(messages.get(0).unwrap().text, String::from_str(&env, "Hello Stellar!"));
  assert_eq!(messages.get(1).unwrap().text, String::from_str(&env, "Second message"));
  assert_eq!(messages.get(0).unwrap().tip_amount, 0);
}

#[test]
fn rejects_empty_message() {
  let env = Env::default();
  let (admin, user, token) = setup(&env);
  let contract_id = env.register(
    Guestbook,
    (admin.clone(), token.address.clone()),
  );
  let client = GuestbookClient::new(&env, &contract_id);

  let result = client.try_sign_guestbook(&user, &String::from_str(&env, ""), &0);
  assert!(result.is_err());
}
