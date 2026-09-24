import { CALENDAR_ITEMS_MOCK, USERS_MOCK } from "./schedule.mocks";

export async function listEventsApi() {
  return CALENDAR_ITEMS_MOCK;
}

// TODO: remove this request mock
export async function listUsersApi() {
  return USERS_MOCK;
}
