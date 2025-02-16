import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logoutAction } from '../(redux)/authSlice';
import { MaterialIcons } from '@expo/vector-icons';

const Profile = () => {
    const { warehouseman } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const handleLogout = () => {
      dispatch(logoutAction());
      router.navigate("/auth/login");
  };
    if (!warehouseman) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No user data available.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>📦 Warehouse Profile</Text>
            </View>

            <View style={styles.profileSection}>
                <Image
                    source={{
                        uri: warehouseman.image || 'https://i.pinimg.com/736x/42/ee/46/42ee4666b21e3e1204ad55456d5f1dd7.jpg',
                    }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{warehouseman.name || 'Name not available'}</Text>
                <Text style={styles.roleBadge}>🏭 Warehouse Manager</Text>
                 <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                 <MaterialIcons name="logout" size={24} color="#FF9900" />
                 </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.label}>📍 Location:</Text>
                <Text style={styles.value}>{warehouseman.city || 'Not available'}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.label}>🎂 DOB:</Text>
                <Text style={styles.value}>{warehouseman.dob || 'Not available'}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.label}>📦 Warehouse ID:</Text>
                <Text style={styles.value}>#{warehouseman.warehouseId}</Text>
            </View>

            <View style={styles.statsSection}>
                <Text style={styles.statsTitle}>📊 Warehouse Stats</Text>
                <View style={styles.statsRow}>
                    <Text style={styles.statsLabel}>Total Items:</Text>
                    <Text style={styles.statsValue}>1,254</Text>
                </View>
                <View style={styles.statsRow}>
                    <Text style={styles.statsLabel}>Items Shipped Today:</Text>
                    <Text style={styles.statsValue}>156</Text>
                </View>
                <View style={styles.statsRow}>
                    <Text style={styles.statsLabel}>Orders Pending:</Text>
                    <Text style={styles.statsValue}>12</Text>
                </View>
            </View>

            <View style={styles.activitySection}>
                <Text style={styles.activityTitle}>🕒 Recent Activity</Text>
                <Text style={styles.activityText}>✔️ Processed 50 orders today</Text>
                <Text style={styles.activityText}>✔️ Updated warehouse inventory</Text>
                <Text style={styles.activityText}>✔️ Scheduled new shipment for tomorrow</Text>
            </View>

            <View style={styles.notificationsSection}>
                <Text style={styles.notificationsTitle}>🔔 Notifications</Text>
                <View style={styles.notification}>
                    <Text style={styles.notificationText}>New shipment arrives at 3:00 PM</Text>
                </View>
                <View style={styles.notification}>
                    <Text style={styles.notificationText}>Inventory audit scheduled for 5:00 PM</Text>
                </View>
            </View>

            <View style={styles.extraSection}>
                <Text style={styles.extraTitle}>🏆 Achievements</Text>
                <Text style={styles.extraText}>✔️ 10+ Years Experience</Text>
                <Text style={styles.extraText}>✔️ Inventory Management Pro</Text>
                <Text style={styles.extraText}>✔️ Logistics & Supply Chain Expert</Text>
            </View>

            <View style={styles.fakeContent}>
                <Text style={styles.fakeContentTitle}>💡 Warehouse Insights</Text>
                <Text style={styles.fakeContentText}>
                    🔑 A streamlined warehouse management system saves time and enhances efficiency.
                    Integrating real-time tracking and predictive analysis leads to smarter logistics.
                </Text>
                <Text style={styles.fakeContentText}>
                    🛠️ Key improvements like AI-based stock management help reduce operational costs.
                </Text>
                <Text style={styles.fakeContentText}>
                    📦 Increased automation in order fulfillment and inventory management increases
                    throughput and reduces human error.
                </Text>
            </View>

            <View style={styles.moreContent}>
                <Text style={styles.fakeContentTitle}>⚡ Warehouse Optimizations</Text>
                <Text style={styles.fakeContentText}>🚀 Automated reporting systems increase transparency.</Text>
                <Text style={styles.fakeContentText}>📈 Efficient stock taking methods result in fewer lost items.</Text>
                <Text style={styles.fakeContentText}>🛠️ Maintenance scheduling optimization leads to fewer downtimes.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    noDataText: {
        fontSize: 18,
        color: '#FF0000',
        marginTop: 20,
    },
    container: {
      
        backgroundColor: '#fff', 
        alignItems: 'center',
        paddingBottom: 20,
    },
    header: {
        width: '100%',
        padding: 20,
        backgroundColor: '#FF9900', 
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', 
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#FF9900', 
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    roleBadge: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF9900',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 5,
    },
    infoBox: {
        width: '90%',
        padding: 15,
        backgroundColor: '#f5f5f5', 
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    label: {
        fontSize: 18,
        color: '#FF9900',
        fontWeight: 'bold',
    },
    value: {
        fontSize: 18,
        color: '#333',
    },
    statsSection: {
        width: '90%',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    statsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF9900',
        marginBottom: 10,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    statsLabel: {
        fontSize: 16,
        color: '#FF9900',
    },
    statsValue: {
        fontSize: 16,
        color: '#333',
    },
    activitySection: {
        width: '90%',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 20,
    },
    activityTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF9900',
        marginBottom: 10,
    },
    activityText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    notificationsSection: {
        width: '90%',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 20,
    },
    notificationsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF9900',
        marginBottom: 10,
    },
    notification: {
        padding: 10,
        backgroundColor: '#FF9900',
        borderRadius: 10,
        marginBottom: 10,
    },
    notificationText: {
        color: '#fff',
        fontSize: 16,
    },
    extraSection: {
        width: '90%',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 20,
    },
    extraTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF9900',
        marginBottom: 10,
    },
    extraText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    fakeContent: {
        width: '90%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    fakeContentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF9900',
    },
    fakeContentText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    logoutButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: '#FF9900',
        borderWidth:1,
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',

    },
    moreContent: {
        width: '90%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;
