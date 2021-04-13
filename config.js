/*
    ACAB (All Chats Are Beautiful)
    Copyright (C) 2021  Zeno Berkhan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const env = require('./secrets');

const config = {
  db: { /* set env vars accordingly */
    host: env.host || 'localhost',
    user: env.user,
    password: env.password,
    database: env.database,
  },
  listPerPage: env.list_per_page || 10,
  secret: env.secret,
};

module.exports = config;
