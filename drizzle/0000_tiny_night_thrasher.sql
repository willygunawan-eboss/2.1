CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`reference_id` text NOT NULL,
	`reference_type` text NOT NULL,
	`date` text NOT NULL,
	`notes` text NOT NULL,
	`performed_by_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`performed_by_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `approval_levels` (
	`id` text PRIMARY KEY NOT NULL,
	`module` text NOT NULL,
	`min_amount` integer NOT NULL,
	`max_amount` integer,
	`role_id` text NOT NULL,
	`level_order` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`assigned_to_id` text NOT NULL,
	`assignment_date` text,
	`return_date` text,
	`notes` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`file_name` text,
	`file_url` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `asset_categories_name_unique` ON `asset_categories` (`name`);--> statement-breakpoint
CREATE TABLE `asset_configurations` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`cpu` text,
	`memory` text,
	`storage` text,
	`raid` text,
	`network_interface` text,
	`operating_system` text,
	`virtualization` text,
	`database` text,
	`application` text,
	`dependencies` text,
	`configuration_version` text,
	`backup_configuration` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_disposals` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`disposal_date` text,
	`disposal_method` text,
	`disposal_reason` text,
	`approved_by` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`document_type` text,
	`document_name` text,
	`file_url` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`action` text,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_licenses` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`license_type` text,
	`license_key` text,
	`license_start` text,
	`license_end` text,
	`renewal_reminder` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`branch_id` text,
	`address` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_maintenance_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`frequency` text,
	`next_schedule_date` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_maintenances` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`type` text,
	`schedule_date` text,
	`engineer_id` text,
	`worklog` text,
	`checklist` text,
	`downtime` text,
	`maintenance_result` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`engineer_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_models` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`manufacturer_id` text,
	`category_id` text,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `asset_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_monitorings` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`alert_type` text,
	`alert_message` text,
	`severity` text,
	`timestamp` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_networks` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`public_ip` text,
	`private_ip` text,
	`subnet` text,
	`gateway` text,
	`dns` text,
	`vlan` text,
	`switch_port` text,
	`router` text,
	`firewall` text,
	`vpn` text,
	`internet_provider` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `asset_warranties` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`vendor` text,
	`warranty_number` text,
	`warranty_type` text,
	`response_time` text,
	`coverage` text,
	`replacement` integer DEFAULT false,
	`rma` text,
	`warranty_expiration` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_code` text NOT NULL,
	`name` text NOT NULL,
	`serial_number` text,
	`barcode` text,
	`qr_code` text,
	`customer_id` text,
	`contract_id` text,
	`project_id` text,
	`owner_company_id` text,
	`branch_id` text,
	`category_id` text,
	`model_id` text,
	`manufacturer_id` text,
	`vendor` text,
	`purchase_date` text,
	`warranty_start` text,
	`warranty_end` text,
	`installation_date` text,
	`commission_date` text,
	`end_of_support` text,
	`end_of_life` text,
	`status` text DEFAULT 'Active' NOT NULL,
	`condition` text,
	`location_id` text,
	`rack` text,
	`room` text,
	`gps` text,
	`latitude` text,
	`longitude` text,
	`ip_address` text,
	`mac_address` text,
	`hostname` text,
	`operating_system` text,
	`firmware` text,
	`model_number` text,
	`asset_value` real,
	`residual_value` real,
	`description` text,
	`legacy_category` text,
	`current_value` integer,
	`legacy_asset_id` text,
	`assigned_to_id` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `asset_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`model_id`) REFERENCES `asset_models`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`location_id`) REFERENCES `asset_locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assets_asset_code_unique` ON `assets` (`asset_code`);--> statement-breakpoint
CREATE INDEX `asset_code_idx` ON `assets` (`asset_code`);--> statement-breakpoint
CREATE INDEX `asset_customer_idx` ON `assets` (`customer_id`);--> statement-breakpoint
CREATE INDEX `asset_contract_idx` ON `assets` (`contract_id`);--> statement-breakpoint
CREATE INDEX `asset_status_idx` ON `assets` (`status`);--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`date` text NOT NULL,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`status` text NOT NULL,
	`work_hours` text NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`details` text,
	`performed_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`performed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `branches` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`phone` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `branches_code_unique` ON `branches` (`code`);--> statement-breakpoint
CREATE TABLE `ci_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ci_categories_name_unique` ON `ci_categories` (`name`);--> statement-breakpoint
CREATE TABLE `ci_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`ci_id` text NOT NULL,
	`document_name` text,
	`file_url` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`ci_id`) REFERENCES `cis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ci_environments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ci_environments_name_unique` ON `ci_environments` (`name`);--> statement-breakpoint
CREATE TABLE `ci_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`ci_id` text NOT NULL,
	`action` text,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`ci_id`) REFERENCES `cis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ci_relationships` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_ci_id` text NOT NULL,
	`child_ci_id` text NOT NULL,
	`dependency_type` text,
	`impact_level` text,
	`priority` integer,
	`relationship_direction` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`parent_ci_id`) REFERENCES `cis`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_ci_id`) REFERENCES `cis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ci_statuses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ci_statuses_name_unique` ON `ci_statuses` (`name`);--> statement-breakpoint
CREATE TABLE `ci_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`ci_id` text NOT NULL,
	`tag` text NOT NULL,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`ci_id`) REFERENCES `cis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cis` (
	`id` text PRIMARY KEY NOT NULL,
	`ci_code` text NOT NULL,
	`name` text NOT NULL,
	`ci_type` text,
	`category_id` text,
	`customer_id` text,
	`contract_id` text,
	`asset_id` text,
	`project_id` text,
	`environment_id` text,
	`status_id` text,
	`criticality` text,
	`owner_id` text,
	`business_owner_id` text,
	`technical_owner_id` text,
	`support_group_id` text,
	`monitoring_profile` text,
	`location` text,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`category_id`) REFERENCES `ci_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`environment_id`) REFERENCES `ci_environments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`status_id`) REFERENCES `ci_statuses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_owner_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`technical_owner_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`support_group_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cis_ci_code_unique` ON `cis` (`ci_code`);--> statement-breakpoint
CREATE INDEX `ci_code_idx` ON `cis` (`ci_code`);--> statement-breakpoint
CREATE INDEX `ci_customer_idx` ON `cis` (`customer_id`);--> statement-breakpoint
CREATE INDEX `ci_asset_idx` ON `cis` (`asset_id`);--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`phone` text,
	`email` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_code_unique` ON `companies` (`code`);--> statement-breakpoint
CREATE TABLE `contract_approvals` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`approval_workflow` text,
	`approval_level` integer,
	`approval_date` text,
	`approved_by` text,
	`status` text,
	`notes` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`file_name` text NOT NULL,
	`file_url` text,
	`file_size` integer,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_billings` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`billing_cycle` text,
	`next_billing` text,
	`last_billing` text,
	`monthly_fee` real,
	`yearly_fee` real,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_coverages` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`covered_asset_id` text,
	`covered_branch_id` text,
	`covered_location` text,
	`covered_device_id` text,
	`covered_user_id` text,
	`coverage_type` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`covered_asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`covered_branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_devices` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`maximum_device` integer,
	`current_device` integer,
	`maximum_user` integer,
	`current_user` integer,
	`maximum_server` integer,
	`current_server` integer,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`document_name` text NOT NULL,
	`document_type` text,
	`file_url` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`action` text,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_renewals` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`renewal_date` text,
	`reminder_date` text,
	`auto_renewal` integer DEFAULT false,
	`renewal_status` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_services` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`service_name` text NOT NULL,
	`service_category` text,
	`service_level` text,
	`included` text,
	`excluded` text,
	`unlimited_support` integer DEFAULT false,
	`remote_support` integer DEFAULT false,
	`onsite_support` integer DEFAULT false,
	`preventive_maintenance` integer DEFAULT false,
	`corrective_maintenance` integer DEFAULT false,
	`emergency_support` integer DEFAULT false,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contract_slas` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`response_time` text,
	`resolution_time` text,
	`business_hours` text,
	`is_24x7` integer DEFAULT false,
	`holiday_calendar` text,
	`escalation_level` text,
	`maximum_downtime` text,
	`penalty_rule` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_number` text NOT NULL,
	`customer_id` text NOT NULL,
	`contract_type` text,
	`contract_category` text,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'Draft',
	`renewal_type` text,
	`auto_renewal` integer DEFAULT false,
	`currency` text,
	`payment_term` text,
	`salesperson_id` text,
	`account_manager_id` text,
	`branch_id` text,
	`company_id` text,
	`description` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`salesperson_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_manager_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contracts_contract_number_unique` ON `contracts` (`contract_number`);--> statement-breakpoint
CREATE INDEX `contract_number_idx` ON `contracts` (`contract_number`);--> statement-breakpoint
CREATE INDEX `contract_customer_idx` ON `contracts` (`customer_id`);--> statement-breakpoint
CREATE INDEX `contract_status_idx` ON `contracts` (`status`);--> statement-breakpoint
CREATE TABLE `customer_addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`address_type` text,
	`address_line1` text NOT NULL,
	`address_line2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`latitude` real,
	`longitude` real,
	`maps_url` text,
	`is_primary` integer DEFAULT false,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customer_bank_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`bank_name` text NOT NULL,
	`account_name` text NOT NULL,
	`account_number` text NOT NULL,
	`swift_code` text,
	`is_primary` integer DEFAULT false,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customer_communications` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`contact_id` text,
	`employee_id` text,
	`channel` text,
	`direction` text,
	`communication_date` text NOT NULL,
	`subject` text,
	`notes` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `customer_contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customer_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`name` text NOT NULL,
	`title` text,
	`contact_type` text,
	`email` text,
	`phone` text,
	`mobile` text,
	`is_primary` integer DEFAULT false,
	`notes` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customer_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`document_type` text,
	`document_name` text NOT NULL,
	`file_url` text,
	`expiry_date` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`legal_name` text,
	`npwp` text,
	`email` text,
	`website` text,
	`phone` text,
	`industry_id` text,
	`category_id` text,
	`group_id` text,
	`status_id` text DEFAULT 'Active',
	`priority_id` text,
	`currency_id` text,
	`payment_term_id` text,
	`salesperson_id` text,
	`account_manager_id` text,
	`branch_id` text,
	`company_id` text,
	`pic` text,
	`address` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`salesperson_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_manager_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_code_unique` ON `customers` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `customers` (`name`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `customers` (`code`);--> statement-breakpoint
CREATE INDEX `industry_idx` ON `customers` (`industry_id`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `customers` (`category_id`);--> statement-breakpoint
CREATE TABLE `dashboard_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`active_employees` integer DEFAULT 0 NOT NULL,
	`total_departments` integer DEFAULT 0 NOT NULL,
	`open_tickets` integer DEFAULT 0 NOT NULL,
	`monthly_revenue` real DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `data_scopes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`level` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_scopes_name_unique` ON `data_scopes` (`name`);--> statement-breakpoint
CREATE TABLE `departments` (
	`id` text PRIMARY KEY NOT NULL,
	`division_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`division_id`) REFERENCES `divisions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_code_unique` ON `departments` (`code`);--> statement-breakpoint
CREATE TABLE `divisions` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `divisions_code_unique` ON `divisions` (`code`);--> statement-breakpoint
CREATE TABLE `employee_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`asset_id` text NOT NULL,
	`given_date` text NOT NULL,
	`return_date` text,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `employee_banks` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`bank_name` text NOT NULL,
	`account_number` text NOT NULL,
	`account_holder` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_bpjs` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`bpjs_kesehatan` text,
	`bpjs_ketenagakerjaan` text
);
--> statement-breakpoint
CREATE TABLE `employee_certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`certification_name` text NOT NULL,
	`institution` text,
	`issue_date` text,
	`expiry_date` text,
	`credential_id` text
);
--> statement-breakpoint
CREATE TABLE `employee_contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`contract_type` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`document_type` text NOT NULL,
	`file_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_emergency_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`name` text NOT NULL,
	`relationship` text NOT NULL,
	`phone` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_families` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`name` text NOT NULL,
	`relationship` text NOT NULL,
	`date_of_birth` text
);
--> statement-breakpoint
CREATE TABLE `employee_leaves` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`leave_type` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_overtimes` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`date` text NOT NULL,
	`hours` real NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_performances` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`review_period` text NOT NULL,
	`score` real NOT NULL,
	`comments` text
);
--> statement-breakpoint
CREATE TABLE `employee_position_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`position` text NOT NULL,
	`department` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text
);
--> statement-breakpoint
CREATE TABLE `employee_promotion_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`old_position` text NOT NULL,
	`new_position` text NOT NULL,
	`promotion_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_salary_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`basic_salary` real NOT NULL,
	`effective_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_shifts` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`shift_name` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_taxes` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`npwp` text NOT NULL,
	`ptkp_status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_trainings` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`training_name` text NOT NULL,
	`date` text NOT NULL,
	`result` text
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_number` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`company_id` text,
	`branch_id` text,
	`department_id` text,
	`position_id` text,
	`status` text DEFAULT 'Active' NOT NULL,
	`join_date` text,
	`avatar` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_number_unique` ON `employees` (`employee_number`);--> statement-breakpoint
CREATE TABLE `inventory_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`type` text NOT NULL,
	`quantity` integer NOT NULL,
	`date` text NOT NULL,
	`reference_id` text NOT NULL,
	`reference_type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`product_name` text NOT NULL,
	`description` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`price` integer NOT NULL,
	`discount_percent` integer DEFAULT 0 NOT NULL,
	`tax_type` text DEFAULT 'No Tax Selected',
	`total` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`date` text NOT NULL,
	`due_date` text NOT NULL,
	`salesperson_id` text,
	`customer_id` text NOT NULL,
	`subtotal` integer NOT NULL,
	`discount_total` integer DEFAULT 0 NOT NULL,
	`additional_discount` integer DEFAULT 0 NOT NULL,
	`shipping_cost` integer DEFAULT 0 NOT NULL,
	`tax_total` integer DEFAULT 0 NOT NULL,
	`down_payment` integer DEFAULT 0 NOT NULL,
	`total` integer NOT NULL,
	`amount_paid` integer DEFAULT 0 NOT NULL,
	`amount_due` integer NOT NULL,
	`notes` text,
	`terms` text,
	`signature_date` text,
	`signature_name` text,
	`status` text DEFAULT 'Unpaid' NOT NULL,
	FOREIGN KEY (`salesperson_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `job_grades` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `job_grades_code_unique` ON `job_grades` (`code`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`pic` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`product_interest` text,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`score` integer DEFAULT 0,
	`owner_id` text,
	`estimated_value` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`owner_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `manufacturers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`support_contact` text,
	`website` text,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `manufacturers_name_unique` ON `manufacturers` (`name`);--> statement-breakpoint
CREATE TABLE `menu_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text NOT NULL,
	`menu` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payroll` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`period` text NOT NULL,
	`basic_salary` real NOT NULL,
	`allowances` real NOT NULL,
	`deductions` real NOT NULL,
	`net_pay` real NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`module` text NOT NULL,
	`action` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_system` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` text PRIMARY KEY NOT NULL,
	`department_id` text NOT NULL,
	`job_grade_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`job_grade_id`) REFERENCES `job_grades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `positions_code_unique` ON `positions` (`code`);--> statement-breakpoint
CREATE TABLE `production_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`assigned_to_id` text,
	`quantity` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text NOT NULL,
	`progress` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`category` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`customer_id` text NOT NULL,
	`manager_id` text,
	`due_date` text NOT NULL,
	`budget` real NOT NULL,
	`status` text NOT NULL,
	`progress` integer NOT NULL,
	`contract_id` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `purchase_order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`date` text NOT NULL,
	`amount` real NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reference_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`sort_order` integer DEFAULT 0,
	`is_system` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reference_groups_code_unique` ON `reference_groups` (`code`);--> statement-breakpoint
CREATE TABLE `reference_values` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`icon` text,
	`sort_order` integer DEFAULT 0,
	`metadata` text,
	`is_default` integer DEFAULT false,
	`is_system` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`group_id`) REFERENCES `reference_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `role_data_scopes` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text NOT NULL,
	`module` text NOT NULL,
	`scope_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scope_id`) REFERENCES `data_scopes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `role_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `role_groups_name_unique` ON `role_groups` (`name`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_system` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`group_id`) REFERENCES `role_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `sales_order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`sales_order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sales_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`salesperson_id` text,
	`date` text NOT NULL,
	`amount` real NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`salesperson_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `slas` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`response_time_minutes` integer NOT NULL,
	`resolution_time_minutes` integer NOT NULL,
	`priority_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`priority_id`) REFERENCES `ticket_priorities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`assigned_to_id` text NOT NULL,
	`due_date` text NOT NULL,
	`status` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`file_name` text NOT NULL,
	`file_url` text NOT NULL,
	`file_type` text,
	`file_size` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`field_name` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE TABLE `ticket_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`comment` text NOT NULL,
	`is_internal` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_impacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE TABLE `ticket_priorities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`color` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE TABLE `ticket_statuses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_closed` integer DEFAULT false,
	`color` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE TABLE `ticket_sub_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_timelines` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`action` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_urgencies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
--> statement-breakpoint
CREATE TABLE `ticket_watchers` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`employee_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_worklogs` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`employee_id` text NOT NULL,
	`time_spent_minutes` integer NOT NULL,
	`work_date` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_number` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`customer_id` text,
	`contract_id` text,
	`asset_id` text,
	`category_id` text,
	`sub_category_id` text,
	`priority_id` text,
	`impact_id` text,
	`urgency_id` text,
	`status_id` text,
	`sla_id` text,
	`assigned_to` text,
	`reported_by` text,
	`expected_resolution_date` text,
	`actual_resolution_date` text,
	`resolution_notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`created_by` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sub_category_id`) REFERENCES `ticket_sub_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`priority_id`) REFERENCES `ticket_priorities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`impact_id`) REFERENCES `ticket_impacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`urgency_id`) REFERENCES `ticket_urgencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`status_id`) REFERENCES `ticket_statuses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sla_id`) REFERENCES `slas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tickets_ticket_number_unique` ON `tickets` (`ticket_number`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`department` text,
	`refresh_token` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`pic` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`address` text,
	`npwp` text,
	`status` text DEFAULT 'Active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
