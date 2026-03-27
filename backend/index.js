// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // mysql2/promise connection

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

/* ================= ENUM VALIDATION ================= */
const validGenders = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];
const validMaritalStatus = ['Single', 'Married', 'Married with Kids', 'Divorced', 'Widowed'];
const validHearAbout = ['Walk-in', 'Social Media', 'Friends / Referrals'];
const validCustomerTypes = ['Customer', 'Reseller'];

/* ================= HELPER ================= */
const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/* ================= GET ALL CUSTOMERS ================= */
app.get('/customers', async (req, res) => {
  try {
    // 1. Fetch all customers
    const [customers] = await db.query(`
      SELECT 
        id,
        full_name,
        contact_number,
        email,
        birthday,
        age,
        gender,
        marital_status,
        city,
        data_consent,
        marketing_consent,
        hear_about,
        date_registered,
        consent_timestamp,
        stamps,
        cust_type,
        has_physical_store,
        store_name,
        store_address,
        tin_number,
        sales_channel
      FROM customers
      ORDER BY CAST(SUBSTRING(id, 3) AS UNSIGNED) ASC
    `);
    

    // 2. Fetch all transactions
    const [transactions] = await db.query(`
      SELECT 
        id, 
        customer_id, 
        date, 
        description, 
        amount, 
        stamps_earned,
        invoice_number,
        is_gift,
        gift_item
      FROM transactions
    `);

    // 3. Map DB fields to frontend format
    const mapped = customers.map((c) => {
      // Map transactions to this customer
      const custTx = transactions
        .filter((t) => t.customer_id.toString() === c.id.toString()) // <- ensures string match
        .map((t) => ({
          id: t.id.toString(),
          date: t.date,
          description: t.description,
          // mysql2 returns DECIMAL as string; convert to number for frontend
          amount: t.amount == null ? null : Number(t.amount),
          stampsEarned: t.stamps_earned || 0,
          invoiceNumber: t.invoice_number || undefined,
          isGift: !!t.is_gift,
          giftItem: t.gift_item || undefined,
        }));

      // Calculate age if missing
      const age = c.age || calculateAge(c.birthday);

      return {
        id: c.id, // keep original DB id
        loyaltyCardId: c.id,
        fullName: c.full_name,
        contactNumber: c.contact_number,
        email: c.email || '',
        birthday: c.birthday,
        age,
        gender: c.gender || '',
        maritalStatus: c.marital_status || '',
        city: c.city || '',
        dataConsent: !!c.data_consent,
        marketingConsent: !!c.marketing_consent,
        hearAbout: c.hear_about || '',
        customerType: c.cust_type || 'Customer',
        hasPhysicalStore: c.has_physical_store ? 'Yes' : 'No',
        storeName: c.store_name || '',
        storeAddress: c.store_address || '',
        tinNumber: c.tin_number || '',
        salesChannel: c.sales_channel || '',
        dateRegistered: c.date_registered
          ? new Date(c.date_registered).toISOString()
          : '',
        consentTimestamp: c.consent_timestamp
          ? new Date(c.consent_timestamp).toISOString()
          : '',
        stamps: c.stamps || 0,
        transactions: custTx,
      };
    });

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

/* ================= CREATE CUSTOMER ================= */
app.post('/customers', async (req, res) => {
  const c = req.body;

  if (
    !c.fullName ||
    !c.contactNumber ||
    !c.birthday ||
    !c.gender ||
    !c.maritalStatus ||
    !c.hearAbout ||
    c.dataConsent == null
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!validGenders.includes(c.gender)) {
    return res.status(400).json({ error: 'Invalid gender' });
  }

  if (!validMaritalStatus.includes(c.maritalStatus)) {
    return res.status(400).json({ error: 'Invalid marital status' });
  }

  if (!validHearAbout.includes(c.hearAbout)) {
    return res.status(400).json({ error: 'Invalid hearAbout value' });
  }

  if (!c.customerType || !validCustomerTypes.includes(c.customerType)) {
    return res.status(400).json({ error: 'Invalid customer type' });
  }

  if (c.customerType === 'Reseller') {
    if (!c.hasPhysicalStore) {
      return res.status(400).json({ error: 'Missing physical store information for reseller' });
    }
    if (c.hasPhysicalStore === 'Yes' && !c.storeName) {
      return res.status(400).json({
        error: 'Store name is required when reseller has a physical store',
      });
    }
    if (c.hasPhysicalStore === 'No' && !c.salesChannel) {
      return res.status(400).json({
        error: 'Sales channel is required when reseller does not have a physical store',
      });
    }
  }

  try {
    const [rows] = await db.query(
      "SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS maxId FROM customers"
    );
    const maxId = rows[0]?.maxId || 0;
    const newId = `LC${maxId + 1}`;

    const dbPayload = {
      id: newId,
      full_name: c.fullName,
      contact_number: c.contactNumber,
      birthday: c.birthday,
      age: calculateAge(c.birthday),
      gender: c.gender,
      marital_status: c.maritalStatus,
      city: c.city || null,
      email: c.email || null,
      data_consent: c.dataConsent ? 1 : 0,
      marketing_consent: c.marketingConsent ? 1 : 0,
      hear_about: c.hearAbout,
      cust_type: c.customerType,
      has_physical_store:
        c.customerType === 'Reseller' && c.hasPhysicalStore === 'Yes' ? 1 : 0,
      store_name:
        c.customerType === 'Reseller' && c.hasPhysicalStore === 'Yes'
          ? c.storeName || null
          : null,
      store_address:
        c.customerType === 'Reseller' && c.hasPhysicalStore === 'Yes'
          ? c.storeAddress || null
          : null,
      tin_number:
        c.customerType === 'Reseller' && c.hasPhysicalStore === 'Yes'
          ? c.tinNumber || null
          : null,
      sales_channel:
        c.customerType === 'Reseller' && c.hasPhysicalStore === 'No'
          ? c.salesChannel || null
          : null,
    };

    await db.query(
      `INSERT INTO customers (
        id,
        full_name,
        contact_number,
        birthday,
        age,
        gender,
        marital_status,
        city,
        email,
        data_consent,
        marketing_consent,
        hear_about,
        cust_type,
        has_physical_store,
        store_name,
        store_address,
        tin_number,
        sales_channel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dbPayload.id,
        dbPayload.full_name,
        dbPayload.contact_number,
        dbPayload.birthday,
        dbPayload.age,
        dbPayload.gender,
        dbPayload.marital_status,
        dbPayload.city,
        dbPayload.email,
        dbPayload.data_consent,
        dbPayload.marketing_consent,
        dbPayload.hear_about,
        dbPayload.cust_type,
        dbPayload.has_physical_store,
        dbPayload.store_name,
        dbPayload.store_address,
        dbPayload.tin_number,
        dbPayload.sales_channel,
      ]
    );

    const [customer] = await db.query('SELECT * FROM customers WHERE id = ?', [
      newId,
    ]);
    res.json(customer[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

/* ================= UPDATE CUSTOMER ================= */
// Frontend sends camelCase; map to DB snake_case
const camelToDb = {
  fullName: 'full_name',
  contactNumber: 'contact_number',
  birthday: 'birthday',
  age: 'age',
  gender: 'gender',
  maritalStatus: 'marital_status',
  city: 'city',
  email: 'email',
  dataConsent: 'data_consent',
  marketingConsent: 'marketing_consent',
  hearAbout: 'hear_about',
  customerType: 'cust_type',
  hasPhysicalStore: 'has_physical_store',
  storeName: 'store_name',
  storeAddress: 'store_address',
  tinNumber: 'tin_number',
  salesChannel: 'sales_channel',
};

app.put('/customers/:id', async (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Customer id is required' });

  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  const dbPayload = {};
  for (const [camel, dbKey] of Object.entries(camelToDb)) {
    if (updates[camel] === undefined) continue;
    let val = updates[camel];
    if (dbKey === 'age') val = parseInt(val, 10);
    if (dbKey === 'birthday' && val) val = String(val).slice(0, 10);
    if (dbKey === 'has_physical_store') {
      // Frontend sends 'Yes' / 'No'
      val = val === 'Yes' ? 1 : 0;
    }
    dbPayload[dbKey] = val;
  }
  if (dbPayload.data_consent !== undefined) dbPayload.data_consent = dbPayload.data_consent ? 1 : 0;
  if (dbPayload.marketing_consent !== undefined) dbPayload.marketing_consent = dbPayload.marketing_consent ? 1 : 0;

  const fieldsToUpdate = Object.keys(dbPayload);
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const values = fieldsToUpdate.map((f) => dbPayload[f]);
  const setString = fieldsToUpdate.map((f) => `${f} = ?`).join(', ');
  const sql = `UPDATE customers SET ${setString} WHERE id = ?`;
  const params = [...values, id];

  let conn;
  try {
    conn = await db.getConnection();
    const [updateResult] = await conn.execute(sql, params);
    const affectedRows = updateResult && updateResult.affectedRows !== undefined ? updateResult.affectedRows : 0;
    await conn.commit();
    console.log(`PUT /customers/${id} – affected rows: ${affectedRows}`);
    if (affectedRows === 0) {
      return res.status(404).json({
        error: 'No customer updated. Make sure the customer id exists in the database.',
        id,
      });
    }

    const [customer] = await conn.execute('SELECT * FROM customers WHERE id = ?', [id]);
    const c = customer[0];
    if (!c) return res.status(404).json({ error: 'Customer not found' });

    // Return camelCase so frontend can use response directly
    res.json({
      id: c.id,
      loyaltyCardId: c.id,
      fullName: c.full_name,
      contactNumber: c.contact_number,
      email: c.email || '',
      birthday: c.birthday,
      age: c.age != null ? c.age : calculateAge(c.birthday),
      gender: c.gender || '',
      maritalStatus: c.marital_status || '',
      city: c.city || '',
      dataConsent: !!c.data_consent,
      marketingConsent: !!c.marketing_consent,
      hearAbout: c.hear_about || '',
      dateRegistered: c.date_registered ? new Date(c.date_registered).toISOString() : '',
      consentTimestamp: c.consent_timestamp ? new Date(c.consent_timestamp).toISOString() : '',
      stamps: c.stamps || 0,
      transactions: [],
    });
  } catch (err) {
    if (conn) try { await conn.rollback(); } catch (_) {}
    console.error(err);
    res.status(500).json({ error: 'Failed to update customer' });
  } finally {
    if (conn) conn.release();
  }
});

/* ================= GET CUSTOMER TRANSACTIONS ================= */
app.get('/customers/:id/transactions', async (req, res) => {
  const { id } = req.params;

  try {
    const [transactions] = await db.query(
      'SELECT * FROM transactions WHERE customer_id = ?',
      [id]
    );
    const normalized = transactions.map(t => ({
      id: t.id.toString(),
      date: t.date,
      description: t.description,
      amount: t.amount == null ? null : Number(t.amount),
      stampsEarned: t.stamps_earned || 0,
      invoiceNumber: t.invoice_number || undefined,
      giftItem: t.gift_item || undefined,
    }));
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/* ================= CREATE TRANSACTION ================= */
app.post('/customers/:id/transactions', async (req, res) => {
  const { id } = req.params;
  const t = req.body;

  if (!t.description || t.stampsEarned == null) {
    return res
      .status(400)
      .json({ error: 'Missing required transaction fields' });
  }

  // Use explicit connection + transaction so stamps and transaction stay consistent
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const amountValue =
      t.amount === undefined || t.amount === null || t.amount === ''
        ? 0
        : Number(t.amount);

    const insertParamsBase = [
      id,
      t.date || new Date(),
      t.description,
      Number.isFinite(amountValue) ? amountValue : 0,
      t.stampsEarned,
      t.invoiceNumber || null,
      t.giftItem ? 1 : 0,
      t.giftItem || null,
    ];

    let insertedId;

    // Attempt insert assuming `transactions.id` is AUTO_INCREMENT
    try {
      const [result] = await conn.execute(
        `INSERT INTO transactions (
          customer_id,
          date,
          description,
          amount,
          stamps_earned,
          invoice_number,
          is_gift,
          gift_item
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        insertParamsBase
      );
      insertedId = result.insertId;
    } catch (e) {
      // Fallback for schemas where `transactions.id` is NOT auto-increment
      const msg = String(e && e.message ? e.message : '');
      if (
        (e && (e.code === 'ER_NO_DEFAULT_FOR_FIELD' || e.code === 'ER_BAD_NULL_ERROR')) &&
        msg.toLowerCase().includes('id')
      ) {
        const [rows] = await conn.execute(
          'SELECT IFNULL(MAX(id), 0) + 1 AS nextId FROM transactions FOR UPDATE'
        );
        const nextId = rows[0].nextId;
        await conn.execute(
          `INSERT INTO transactions (
            id,
            customer_id,
            date,
            description,
            amount,
            stamps_earned,
            invoice_number,
            is_gift,
            gift_item
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [nextId, ...insertParamsBase]
        );
        insertedId = nextId;
      } else {
        throw e;
      }
    }

    await conn.execute('UPDATE customers SET stamps = stamps + ? WHERE id = ?', [
      t.stampsEarned,
      id,
    ]);

    await conn.commit();

    const [transaction] = await conn.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [insertedId]
    );
    const tx = transaction[0];
    res.json({
      id: tx.id.toString(),
      date: tx.date,
      description: tx.description,
      amount: tx.amount == null ? null : Number(tx.amount),
      stampsEarned: tx.stamps_earned || 0,
      invoiceNumber: tx.invoice_number || undefined,
      giftItem: tx.gift_item || undefined,
    });
  } catch (err) {
    if (conn) try { await conn.rollback(); } catch (_) {}
    console.error(err);
    res.status(500).json({ error: 'Failed to add transaction' });
  } finally {
    if (conn) conn.release();
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});