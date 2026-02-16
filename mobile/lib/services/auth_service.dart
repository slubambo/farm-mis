import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/models/auth_models.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _apiClient = ApiClient();

  // Register new user and tenant
  Future<AuthResponse> register({
    required String tenantName,
    required String tenantSlug,
    required String fullName,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        '/auth/register',
        body: {
          'tenant_name': tenantName,
          'tenant_slug': tenantSlug,
          'full_name': fullName,
          'email': email,
          'password': password,
        },
        includeAuth: false,
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final authResponse = AuthResponse.fromJson(data);
        
        // Save token
        await _apiClient.setToken(authResponse.accessToken);
        
        // Save user and tenant info
        await _saveUserInfo(authResponse.user, authResponse.tenant);
        
        return authResponse;
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Registration failed');
      }
    } catch (e) {
      throw Exception('Registration error: $e');
    }
  }

  // Login
  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        '/auth/login',
        body: {
          'email': email,
          'password': password,
        },
        includeAuth: false,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final authResponse = AuthResponse.fromJson(data);
        
        // Save token
        await _apiClient.setToken(authResponse.accessToken);
        
        // Save user and tenant info
        await _saveUserInfo(authResponse.user, authResponse.tenant);
        
        return authResponse;
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  // Logout
  Future<void> logout() async {
    await _apiClient.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_info');
    await prefs.remove('tenant_info');
  }

  // Get current user
  Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString('user_info');
    if (userJson != null) {
      return User.fromJson(jsonDecode(userJson));
    }
    return null;
  }

  // Get current tenant
  Future<Tenant?> getCurrentTenant() async {
    final prefs = await SharedPreferences.getInstance();
    final tenantJson = prefs.getString('tenant_info');
    if (tenantJson != null) {
      return Tenant.fromJson(jsonDecode(tenantJson));
    }
    return null;
  }

  // Check if logged in
  Future<bool> isLoggedIn() async {
    final token = await _apiClient.getToken();
    return token != null;
  }

  // Save user info
  Future<void> _saveUserInfo(User user, Tenant tenant) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_info', jsonEncode(user.toJson()));
    await prefs.setString('tenant_info', jsonEncode(tenant.toJson()));
  }

  // Verify token (optional - for checking if token is still valid)
  Future<bool> verifyToken() async {
    try {
      final response = await _apiClient.get('/auth/me');
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
