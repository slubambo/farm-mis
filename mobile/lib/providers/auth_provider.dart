import 'package:flutter/material.dart';
import '../data/models/auth_models.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _user;
  Tenant? _tenant;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  Tenant? get tenant => _tenant;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;

  // Initialize - check if user is already logged in
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      final isLoggedIn = await _authService.isLoggedIn();
      if (isLoggedIn) {
        _user = await _authService.getCurrentUser();
        _tenant = await _authService.getCurrentTenant();
        
        // Verify token is still valid
        final isValid = await _authService.verifyToken();
        if (!isValid) {
          await logout();
        }
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Login
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.login(
        email: email,
        password: password,
      );
      
      _user = response.user;
      _tenant = response.tenant;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Register
  Future<bool> register({
    required String tenantName,
    required String tenantSlug,
    required String fullName,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.register(
        tenantName: tenantName,
        tenantSlug: tenantSlug,
        fullName: fullName,
        email: email,
        password: password,
      );
      
      _user = response.user;
      _tenant = response.tenant;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Logout
  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    _tenant = null;
    notifyListeners();
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
