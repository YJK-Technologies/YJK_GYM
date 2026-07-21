
const DB_CONFIG = {
  host: '95.216.47.254',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'P@$ql2k25'
};

// Database service functions
export const dbService = {
  async query(sql: string, params: any[] = []) {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
          config: DB_CONFIG
        })
      });
      
      if (!response.ok) {
        throw new Error(`Database query failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Member workouts queries
  async getMemberWorkouts(memberId: string) {
    const sql = `
      SELECT w.*, p.name as program_name, p.description as program_description
      FROM workouts w
      LEFT JOIN programs p ON w.program_id = p.id
      WHERE w.member_id = $1
      ORDER BY w.created_at DESC
    `;
    return this.query(sql, [memberId]);
  },

  async getWorkoutPrograms() {
    const sql = `
      SELECT * FROM programs
      WHERE is_active = true
      ORDER BY name
    `;
    return this.query(sql);
  },

  async addWorkoutLog(memberId: string, programId: string, exercises: any[]) {
    const sql = `
      INSERT INTO workouts (member_id, program_id, exercises, completed_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    return this.query(sql, [memberId, programId, JSON.stringify(exercises)]);
  },

  // Trainer (Faculty) queries
  async getTrainers() {
    const sql = `
      SELECT * FROM trainers
      WHERE is_active = true
      ORDER BY name
    `;
    return this.query(sql);
  },

  async getTrainerById(id: string) {
    const sql = `SELECT * FROM trainers WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async addTrainer(data: {
    name: string;
    email: string;
    phone: string;
    photo?: string;
    certifications: string[];
    specializations: string[];
    experience: number;
    schedule: string;
    bio: string;
  }) {
    const sql = `
      INSERT INTO trainers (name, email, phone, photo, certifications, specializations, experience, schedule, bio, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING *
    `;
    return this.query(sql, [
      data.name,
      data.email,
      data.phone,
      data.photo || null,
      JSON.stringify(data.certifications),
      JSON.stringify(data.specializations),
      data.experience,
      data.schedule,
      data.bio
    ]);
  },

  async updateTrainer(id: string, data: Partial<{
    name: string;
    email: string;
    phone: string;
    photo: string;
    certifications: string[];
    specializations: string[];
    experience: number;
    schedule: string;
    bio: string;
    is_active: boolean;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE trainers SET ${setClause} WHERE id = $1 RETURNING *`;
    return this.query(sql, [id, ...values]);
  },

  async deleteTrainer(id: string) {
    const sql = `UPDATE trainers SET is_active = false WHERE id = $1`;
    return this.query(sql, [id]);
  },

  // Diet Plan queries
  async getDietPlans() {
    const sql = `
      SELECT * FROM diet_plans
      WHERE is_active = true
      ORDER BY name
    `;
    return this.query(sql);
  },

  async getDietPlanById(id: string) {
    const sql = `SELECT * FROM diet_plans WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async getMemberDietPlan(memberId: string) {
    const sql = `
      SELECT dp.* FROM diet_plans dp
      JOIN member_diet_plans mdp ON dp.id = mdp.diet_plan_id
      WHERE mdp.member_id = $1 AND dp.is_active = true
    `;
    return this.query(sql, [memberId]);
  },

  async addDietPlan(data: {
    name: string;
    category: string;
    description: string;
    daily_calories: number;
    duration: string;
    goals: string[];
    restrictions: string[];
    meals: object;
    trainer_id?: string;
  }) {
    const sql = `
      INSERT INTO diet_plans (name, category, description, daily_calories, duration, goals, restrictions, meals, trainer_id, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING *
    `;
    return this.query(sql, [
      data.name,
      data.category,
      data.description,
      data.daily_calories,
      data.duration,
      JSON.stringify(data.goals),
      JSON.stringify(data.restrictions),
      JSON.stringify(data.meals),
      data.trainer_id || null
    ]);
  },

  async updateDietPlan(id: string, data: Partial<{
    name: string;
    category: string;
    description: string;
    daily_calories: number;
    duration: string;
    goals: string[];
    restrictions: string[];
    meals: object;
    trainer_id: string;
    is_active: boolean;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE diet_plans SET ${setClause} WHERE id = $1 RETURNING *`;
    return this.query(sql, [id, ...values]);
  },

  async deleteDietPlan(id: string) {
    const sql = `UPDATE diet_plans SET is_active = false WHERE id = $1`;
    return this.query(sql, [id]);
  },

  // Member queries - CPR is the primary key
  async getMembers() {
    const sql = `
      SELECT * FROM members
      WHERE is_active = true
      ORDER BY full_name
    `;
    return this.query(sql);
  },

  async getMemberByCpr(cpr: string) {
    const sql = `SELECT * FROM members WHERE cpr = $1`;
    return this.query(sql, [cpr]);
  },

  async addMember(data: {
    cpr: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    bahrain_mobile: string;
    whatsapp_number: string;
    email: string;
    address: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relation: string;
    joined_date: string;
    plan_expiry_date: string;
    membership_type: string;
    receive_promotions: boolean;
    receive_notifications: boolean;
    photo?: string;
  }) {
    const sql = `
      INSERT INTO members (cpr, full_name, date_of_birth, gender, bahrain_mobile, whatsapp_number, email, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, joined_date, plan_expiry_date, membership_type, is_active, receive_promotions, receive_notifications, photo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, $15, $16, $17)
      RETURNING *
    `;
    return this.query(sql, [
      data.cpr,
      data.full_name,
      data.date_of_birth,
      data.gender,
      data.bahrain_mobile,
      data.whatsapp_number,
      data.email,
      data.address,
      data.emergency_contact_name,
      data.emergency_contact_phone,
      data.emergency_contact_relation,
      data.joined_date,
      data.plan_expiry_date,
      data.membership_type,
      data.receive_promotions,
      data.receive_notifications,
      data.photo || null
    ]);
  },

  async updateMember(cpr: string, data: Partial<{
    full_name: string;
    date_of_birth: string;
    gender: string;
    bahrain_mobile: string;
    whatsapp_number: string;
    email: string;
    address: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relation: string;
    joined_date: string;
    plan_expiry_date: string;
    membership_type: string;
    is_active: boolean;
    receive_promotions: boolean;
    receive_notifications: boolean;
    photo: string;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE members SET ${setClause} WHERE cpr = $1 RETURNING *`;
    return this.query(sql, [cpr, ...values]);
  },

  async deleteMember(cpr: string) {
    const sql = `UPDATE members SET is_active = false WHERE cpr = $1`;
    return this.query(sql, [cpr]);
  },

  async getExpiringMembers(days: number) {
    const sql = `
      SELECT * FROM members
      WHERE is_active = true
        AND plan_expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + $1
      ORDER BY plan_expiry_date
    `;
    return this.query(sql, [days]);
  },

  async getMembersForNotification() {
    const sql = `
      SELECT * FROM members
      WHERE is_active = true AND receive_notifications = true
      ORDER BY full_name
    `;
    return this.query(sql);
  },

  async getMembersForPromotion() {
    const sql = `
      SELECT * FROM members
      WHERE is_active = true AND receive_promotions = true
      ORDER BY full_name
    `;
    return this.query(sql);
  },

  // Workout Program queries
  async getWorkoutProgramsAdmin() {
    const sql = `
      SELECT wp.*, t.name as faculty_name 
      FROM workout_programs wp
      LEFT JOIN trainers t ON wp.assigned_faculty = t.id
      ORDER BY wp.name
    `;
    return this.query(sql);
  },

  async getWorkoutProgramById(id: string) {
    const sql = `SELECT * FROM workout_programs WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async addWorkoutProgram(data: {
    name: string;
    description: string;
    category: string;
    difficulty_level: string;
    goals: string[];
    exercises: object[];
    duration_per_session: string;
    sessions_per_week: number;
    assigned_faculty: string;
    working_hours: string;
  }) {
    const sql = `
      INSERT INTO workout_programs (name, description, category, difficulty_level, goals, exercises, duration_per_session, sessions_per_week, assigned_faculty, working_hours, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
      RETURNING *
    `;
    return this.query(sql, [
      data.name,
      data.description,
      data.category,
      data.difficulty_level,
      JSON.stringify(data.goals),
      JSON.stringify(data.exercises),
      data.duration_per_session,
      data.sessions_per_week,
      data.assigned_faculty,
      data.working_hours
    ]);
  },

  async updateWorkoutProgram(id: string, data: Partial<{
    name: string;
    description: string;
    category: string;
    difficulty_level: string;
    goals: string[];
    exercises: object[];
    duration_per_session: string;
    sessions_per_week: number;
    assigned_faculty: string;
    working_hours: string;
    is_active: boolean;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE workout_programs SET ${setClause} WHERE id = $1 RETURNING *`;
    return this.query(sql, [id, ...values]);
  },

  async deleteWorkoutProgram(id: string) {
    const sql = `UPDATE workout_programs SET is_active = false WHERE id = $1`;
    return this.query(sql, [id]);
  },

  // Package queries
  async getPackages() {
    const sql = `
      SELECT p.*, wp.name as program_name, t.name as faculty_name
      FROM packages p
      LEFT JOIN workout_programs wp ON p.program_id = wp.id
      LEFT JOIN trainers t ON p.faculty_id = t.id
      ORDER BY p.name
    `;
    return this.query(sql);
  },

  async getPackageById(id: string) {
    const sql = `SELECT * FROM packages WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async getPackagesByProgram(programId: string) {
    const sql = `
      SELECT * FROM packages
      WHERE program_id = $1 AND is_active = true
      ORDER BY duration_days
    `;
    return this.query(sql, [programId]);
  },

  async getActivePackages() {
    const sql = `
      SELECT p.*, wp.name as program_name, t.name as faculty_name
      FROM packages p
      LEFT JOIN workout_programs wp ON p.program_id = wp.id
      LEFT JOIN trainers t ON p.faculty_id = t.id
      WHERE p.is_active = true
      ORDER BY p.name
    `;
    return this.query(sql);
  },

  async addPackage(data: {
    name: string;
    package_type: string;
    duration_days: number;
    price: number;
    program_id: string;
    features: string[];
    discount_percentage: number;
    faculty_id: string;
    working_hours: string;
  }) {
    const sql = `
      INSERT INTO packages (name, package_type, duration_days, price, program_id, features, discount_percentage, faculty_id, working_hours, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING *
    `;
    return this.query(sql, [
      data.name,
      data.package_type,
      data.duration_days,
      data.price,
      data.program_id,
      JSON.stringify(data.features),
      data.discount_percentage,
      data.faculty_id,
      data.working_hours
    ]);
  },

  async updatePackage(id: string, data: Partial<{
    name: string;
    package_type: string;
    duration_days: number;
    price: number;
    program_id: string;
    features: string[];
    discount_percentage: number;
    faculty_id: string;
    working_hours: string;
    is_active: boolean;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE packages SET ${setClause} WHERE id = $1 RETURNING *`;
    return this.query(sql, [id, ...values]);
  },

  async deletePackage(id: string) {
    const sql = `UPDATE packages SET is_active = false WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async getPackagesByType(type: string) {
    const sql = `
      SELECT p.*, wp.name as program_name, t.name as faculty_name
      FROM packages p
      LEFT JOIN workout_programs wp ON p.program_id = wp.id
      LEFT JOIN trainers t ON p.faculty_id = t.id
      WHERE p.package_type = $1 AND p.is_active = true
      ORDER BY p.price
    `;
    return this.query(sql, [type]);
  },

  // Payment queries
  async getPayments() {
    const sql = `
      SELECT * FROM payments
      ORDER BY payment_date DESC
    `;
    return this.query(sql);
  },

  async getPaymentById(id: string) {
    const sql = `SELECT * FROM payments WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async getPaymentsByMember(cpr: string) {
    const sql = `
      SELECT * FROM payments
      WHERE member_cpr = $1
      ORDER BY payment_date DESC
    `;
    return this.query(sql, [cpr]);
  },

  async getPaymentsByDateRange(fromDate: string, toDate: string) {
    const sql = `
      SELECT * FROM payments
      WHERE payment_date BETWEEN $1 AND $2
      ORDER BY payment_date DESC
    `;
    return this.query(sql, [fromDate, toDate]);
  },

  async addPayment(data: {
    member_cpr: string;
    member_name: string;
    package_id: string;
    package_name: string;
    original_amount: number;
    discount_amount: number;
    final_amount: number;
    payment_method: string;
    coupon_code: string | null;
    status: string;
    receipt_number: string;
    notes: string;
  }) {
    const sql = `
      INSERT INTO payments (member_cpr, member_name, package_id, package_name, original_amount, discount_amount, final_amount, payment_method, coupon_code, status, payment_date, receipt_number, notes, posted_to_external)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11, $12, false)
      RETURNING *
    `;
    return this.query(sql, [
      data.member_cpr,
      data.member_name,
      data.package_id,
      data.package_name,
      data.original_amount,
      data.discount_amount,
      data.final_amount,
      data.payment_method,
      data.coupon_code,
      data.status,
      data.receipt_number,
      data.notes
    ]);
  },

  async updatePayment(id: string, data: Partial<{
    status: string;
    notes: string;
    posted_to_external: boolean;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE payments SET ${setClause} WHERE id = $1 RETURNING *`;
    return this.query(sql, [id, ...values]);
  },

  async markPaymentAsPosted(id: string) {
    const sql = `UPDATE payments SET posted_to_external = true WHERE id = $1 RETURNING *`;
    return this.query(sql, [id]);
  },

  async getPaymentStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'Completed' THEN final_amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(discount_amount) as total_discounts
      FROM payments
    `;
    return this.query(sql);
  },

  // Coupon queries
  async getCoupons() {
    const sql = `
      SELECT * FROM coupons
      ORDER BY created_at DESC
    `;
    return this.query(sql);
  },

  async getCouponByCode(code: string) {
    const sql = `SELECT * FROM coupons WHERE code = $1`;
    return this.query(sql, [code.toUpperCase()]);
  },

  async getActiveCoupons() {
    const sql = `
      SELECT * FROM coupons
      WHERE status = 'Active' 
        AND valid_from <= CURRENT_DATE 
        AND valid_until >= CURRENT_DATE
        AND (max_uses IS NULL OR current_uses < max_uses)
      ORDER BY code
    `;
    return this.query(sql);
  },

  async addCoupon(data: {
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    minimum_purchase: number;
    valid_from: string;
    valid_until: string;
    max_uses: number | null;
    applicable_packages: string[];
    status: string;
  }) {
    const sql = `
      INSERT INTO coupons (code, description, discount_type, discount_value, minimum_purchase, valid_from, valid_until, max_uses, current_uses, applicable_packages, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10)
      RETURNING *
    `;
    return this.query(sql, [
      data.code.toUpperCase(),
      data.description,
      data.discount_type,
      data.discount_value,
      data.minimum_purchase,
      data.valid_from,
      data.valid_until,
      data.max_uses,
      JSON.stringify(data.applicable_packages),
      data.status
    ]);
  },

  async updateCoupon(id: string, data: Partial<{
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    minimum_purchase: number;
    valid_from: string;
    valid_until: string;
    max_uses: number | null;
    applicable_packages: string[];
    status: string;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE coupons SET ${setClause} WHERE id = $1 RETURNING *`;
    return this.query(sql, [id, ...values]);
  },

  async deleteCoupon(id: string) {
    const sql = `DELETE FROM coupons WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async applyCoupon(code: string, packageId: string, amount: number) {
    const coupon = await this.getCouponByCode(code);
    if (!coupon || coupon.length === 0) {
      return { valid: false, error: 'Invalid coupon code' };
    }
    
    const c = coupon[0];
    if (c.status !== 'Active') {
      return { valid: false, error: 'Coupon is not active' };
    }
    
    const now = new Date();
    if (new Date(c.valid_from) > now || new Date(c.valid_until) < now) {
      return { valid: false, error: 'Coupon has expired' };
    }
    
    if (c.max_uses && c.current_uses >= c.max_uses) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }
    
    if (amount < c.minimum_purchase) {
      // return { valid: false, error: `Minimum purchase of BHD ${c.minimum_purchase} required` };
      return { valid: false, error: `Minimum purchase of ${c.minimum_purchase} required` };
    }
    
    const discount = c.discount_type === 'percentage' 
      ? (amount * c.discount_value / 100)
      : c.discount_value;
    
    return { valid: true, discount, coupon: c };
  },

  async incrementCouponUsage(id: string) {
    const sql = `UPDATE coupons SET current_uses = current_uses + 1 WHERE id = $1 RETURNING *`;
    return this.query(sql, [id]);
  },

  // Notification Settings queries
  async getNotificationSettings() {
    const sql = `SELECT * FROM notification_settings ORDER BY id LIMIT 1`;
    return this.query(sql);
  },

  async updateEmailSettings(data: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    from_email: string;
    from_name: string;
    use_ssl: boolean;
  }) {
    const sql = `
      INSERT INTO notification_settings (id, smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_ssl, updated_at)
      VALUES (1, $1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (id) DO UPDATE SET
        smtp_host = $1, smtp_port = $2, smtp_username = $3, smtp_password = $4,
        from_email = $5, from_name = $6, use_ssl = $7, updated_at = NOW()
      RETURNING *
    `;
    return this.query(sql, [
      data.smtp_host,
      data.smtp_port,
      data.smtp_username,
      data.smtp_password,
      data.from_email,
      data.from_name,
      data.use_ssl
    ]);
  },

  async updateSmsSettings(data: {
    sms_provider: string;
    sms_api_key: string;
    sms_api_secret: string;
    sms_sender_id: string;
    sms_country_code: string;
  }) {
    const sql = `
      INSERT INTO notification_settings (id, sms_provider, sms_api_key, sms_api_secret, sms_sender_id, sms_country_code, updated_at)
      VALUES (1, $1, $2, $3, $4, $5, NOW())
      ON CONFLICT (id) DO UPDATE SET
        sms_provider = $1, sms_api_key = $2, sms_api_secret = $3,
        sms_sender_id = $4, sms_country_code = $5, updated_at = NOW()
      RETURNING *
    `;
    return this.query(sql, [
      data.sms_provider,
      data.sms_api_key,
      data.sms_api_secret,
      data.sms_sender_id,
      data.sms_country_code
    ]);
  },

  async updateWhatsAppSettings(data: {
    whatsapp_provider: string;
    whatsapp_api_key: string;
    whatsapp_phone_id: string;
    whatsapp_access_token: string;
    whatsapp_business_id: string;
  }) {
    const sql = `
      INSERT INTO notification_settings (id, whatsapp_provider, whatsapp_api_key, whatsapp_phone_id, whatsapp_access_token, whatsapp_business_id, updated_at)
      VALUES (1, $1, $2, $3, $4, $5, NOW())
      ON CONFLICT (id) DO UPDATE SET
        whatsapp_provider = $1, whatsapp_api_key = $2, whatsapp_phone_id = $3,
        whatsapp_access_token = $4, whatsapp_business_id = $5, updated_at = NOW()
      RETURNING *
    `;
    return this.query(sql, [
      data.whatsapp_provider,
      data.whatsapp_api_key,
      data.whatsapp_phone_id,
      data.whatsapp_access_token,
      data.whatsapp_business_id
    ]);
  },

  // Notification queries
  async getNotifications() {
    const sql = `
      SELECT * FROM notifications
      ORDER BY created_at DESC
    `;
    return this.query(sql);
  },

  async getNotificationById(id: string) {
    const sql = `SELECT * FROM notifications WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async addNotification(data: {
    title: string;
    message: string;
    channel: string;
    target_audience: string;
    recipients_count: number;
    status: string;
    created_by: string;
  }) {
    const sql = `
      INSERT INTO notifications (title, message, channel, target_audience, recipients_count, sent_count, failed_count, status, created_at, created_by)
      VALUES ($1, $2, $3, $4, $5, 0, 0, $6, NOW(), $7)
      RETURNING *
    `;
    return this.query(sql, [
      data.title,
      data.message,
      data.channel,
      data.target_audience,
      data.recipients_count,
      data.status,
      data.created_by
    ]);
  },

  async updateNotificationStatus(id: string, status: string, sentCount?: number, failedCount?: number) {
    let sql = `UPDATE notifications SET status = $2, sent_at = NOW()`;
    const params: any[] = [id, status];
    
    if (sentCount !== undefined) {
      sql += `, sent_count = $${params.length + 1}`;
      params.push(sentCount);
    }
    if (failedCount !== undefined) {
      sql += `, failed_count = $${params.length + 1}`;
      params.push(failedCount);
    }
    
    sql += ` WHERE id = $1 RETURNING *`;
    return this.query(sql, params);
  },

  // Notification Template queries
  async getNotificationTemplates() {
    const sql = `
      SELECT * FROM notification_templates
      ORDER BY name
    `;
    return this.query(sql);
  },

  async getTemplateById(id: string) {
    const sql = `SELECT * FROM notification_templates WHERE id = $1`;
    return this.query(sql, [id]);
  },

  async getTemplatesByChannel(channel: string) {
    const sql = `
      SELECT * FROM notification_templates
      WHERE channel = $1 AND is_active = true
      ORDER BY name
    `;
    return this.query(sql, [channel]);
  },

  async addTemplate(data: {
    name: string;
    channel: string;
    subject: string;
    content: string;
    category: string;
    is_active: boolean;
  }) {
    const sql = `
      INSERT INTO notification_templates (name, channel, subject, content, category, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    return this.query(sql, [
      data.name,
      data.channel,
      data.subject,
      data.content,
      data.category,
      data.is_active
    ]);
  },

  async updateTemplate(id: string, data: Partial<{
    name: string;
    channel: string;
    subject: string;
    content: string;
    category: string;
    is_active: boolean;
  }>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const sql = `UPDATE notification_templates SET ${setClause} WHERE id = $1 RETURNING *`;
    return this.query(sql, [id, ...values]);
  },

  async deleteTemplate(id: string) {
    const sql = `DELETE FROM notification_templates WHERE id = $1`;
    return this.query(sql, [id]);
  }
};
