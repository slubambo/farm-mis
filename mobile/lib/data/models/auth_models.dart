class User {
  final String id;
  final String email;
  final String fullName;
  final String role;
  final String tenantId;

  User({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    required this.tenantId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      fullName: json['full_name'],
      role: json['role'],
      tenantId: json['tenant_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'role': role,
      'tenant_id': tenantId,
    };
  }
}

class Tenant {
  final String id;
  final String name;
  final String slug;
  final String? logoUrl;
  final String? primaryColor;
  final String? secondaryColor;

  Tenant({
    required this.id,
    required this.name,
    required this.slug,
    this.logoUrl,
    this.primaryColor,
    this.secondaryColor,
  });

  factory Tenant.fromJson(Map<String, dynamic> json) {
    return Tenant(
      id: json['id'],
      name: json['name'],
      slug: json['slug'],
      logoUrl: json['logo_url'],
      primaryColor: json['primary_color'],
      secondaryColor: json['secondary_color'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'logo_url': logoUrl,
      'primary_color': primaryColor,
      'secondary_color': secondaryColor,
    };
  }
}

class AuthResponse {
  final String accessToken;
  final User user;
  final Tenant tenant;

  AuthResponse({
    required this.accessToken,
    required this.user,
    required this.tenant,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['access_token'],
      user: User.fromJson(json['user']),
      tenant: Tenant.fromJson(json['tenant']),
    );
  }
}
