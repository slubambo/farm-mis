import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../data/models/auth_models.dart';
import '../utils/api_config.dart';

class ApiClient {
  final String baseUrl = ApiConfig.baseUrl;
  String? _token;

  // Singleton pattern
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  // Set token
  Future<void> setToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  // Get token
  Future<String?> getToken() async {
    if (_token != null) return _token;
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    return _token;
  }

  // Clear token
  Future<void> clearToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  // Get headers
  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // POST request
  Future<http.Response> post(
    String endpoint, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(includeAuth: includeAuth);

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // GET request
  Future<http.Response> get(
    String endpoint, {
    Map<String, String>? queryParams,
    bool includeAuth = true,
  }) async {
    var url = Uri.parse('$baseUrl$endpoint');
    if (queryParams != null) {
      url = url.replace(queryParameters: queryParams);
    }

    final headers = await _getHeaders(includeAuth: includeAuth);

    try {
      final response = await http.get(
        url,
        headers: headers,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // PUT request
  Future<http.Response> put(
    String endpoint, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(includeAuth: includeAuth);

    try {
      final response = await http.put(
        url,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // DELETE request
  Future<http.Response> delete(
    String endpoint, {
    bool includeAuth = true,
  }) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(includeAuth: includeAuth);

    try {
      final response = await http.delete(
        url,
        headers: headers,
      ).timeout(const Duration(seconds: 30));

      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
