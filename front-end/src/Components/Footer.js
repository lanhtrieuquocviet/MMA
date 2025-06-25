import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "../constants";

const Footer = () => {
  const openFacebookLink = () => {
    Linking.openURL("https://facebook.com/viethaw123").catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  return (
    <View style={styles.footer}>
      {/* Thông tin liên hệ */}
      <Text style={styles.contactText}>Liên hệ với chúng tôi:</Text>

      {/* Số điện thoại */}
      <View style={styles.contactItem}>
        <Icon name="phone" size={20} color="black" />
        <Text style={styles.contactInfo}> 0363.634.832</Text>
      </View>

      {/* Email */}
      <View style={styles.contactItem}>
        <Icon name="email" size={20} color="black" />
        <Text style={styles.contactInfo}> vietltqhe173238@gmail.com</Text>
      </View>

      {/* Địa chỉ */}
      <View style={styles.contactItem}>
        <Icon name="location-on" size={20} color="black" />
        <Text style={styles.contactInfo}> Hoa Lac, TP.HN</Text>
      </View>

      {/* Liên kết Facebook */}
      <TouchableOpacity style={styles.socialLink} onPress={openFacebookLink}>
        <Icon name="facebook" size={24} color="#1877F2" />
        <Text style={styles.socialLinkText}>
          Theo dõi chúng tôi trên Facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  contactText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textBlack,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.textGray,
  },
  socialLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  socialLinkText: {
    fontSize: 14,
    color: "#1877F2",
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default Footer;
